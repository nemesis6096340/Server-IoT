import ModbusRTU from "modbus-serial";
import moment from 'moment';
import * as helpers from "../lib/helpers.js";
moment.locale('es');

import schedule from 'node-schedule';
import http from 'http';
import fs from 'fs';
import pool from "../database.js";
import request from "request";

import Devices from "../models/devices.models.js";
const devices_model = new Devices();

import Datalogger from "../models/datalogger.js";
const datalogger_model = new Datalogger();

var networkErrors = [
    "ESOCKETTIMEDOUT",
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    "EHOSTUNREACH",
    "ENETRESET",
    "ECONNABORTED",
    "ENETUNREACH",
    "ENOTCONN",
    "ESHUTDOWN",
    "EHOSTDOWN",
    "ENETDOWN",
    "EWOULDBLOCK",
    "EAGAIN"
];

const ADDRESS_MODBUS_DATALOGGER = 300;

class DataloggerRuntime{

    constructor(id, ip, port, index){
        this.id = id;
        this.ip = ip;
        this.port = port;
        this.index = index;
        this.client = new ModbusRTU();
        this.timeoutRunRef = null;
        this.timeoutConnectRef = null;
    };

    connect(){
        // clear pending timeouts
        clearTimeout(this.timeoutConnectRef);
        
        // if client already open, just run
        if (this.client.isOpen) {
            console.log("Client open");
            //this.run.bind(this);
            this.run();
        }

        // if client closed, open a new connection
        this.client.connectTCP(this.ip, { port: this.port })
            .then(this.setClient.bind(this))
            .then(function() {
                console.log(new Date().toISOString(), "Connected"); })
            .catch(function(e) {
                console.log(new Date().toISOString(), e.message);
                this.checkError(e).bind(this);
            }.bind(this));
    };

    setClient() {
        // set the client's unit id
        // set a timout for requests default is null (no timeout)
        this.client.setID(this.id);
        this.client.setTimeout(5000);
        console.log("Set Client");
        // run program
        this.run();
    };

    run() {
        // clear pending timeouts
        clearTimeout(this.timeoutRunRef);
        
        // read the 4 registers starting at address 5
        this.client.readInputRegisters(ADDRESS_MODBUS_DATALOGGER, 16)
            .then(function(d) {              
                register_data(this.index, d.data);
            }.bind(this))
            .then(function() {
                this.timeoutRunRef = setTimeout(this.run.bind(this), 1000);
            }.bind(this))
            .catch(function(e) {
                console.log(e.message);
                let current_time = Math.floor(new Date().getTime() / 1000.0);                
                let file_path = `./logs/THM/${devices[this.index].device.id}`;
                if (!fs.existsSync(file_path)) {
                    fs.mkdirSync(file_path, { recursive: true });
                }
                let file_name = moment(new Date(current_time * 1000)).format('YYYYMMDD');
                fs.appendFile(`${file_path}/${file_name}.log`, `${moment(new Date(current_time * 1000)).format('YYYY-MM-DD hh:mm:ss ')} ${e.errno} : ${e.message}\n`, function (err) {
                    if (err) return console.log(err);
                });
                this.checkError(e);
                //console.log(new Date().toISOString(), e.message);
            }.bind(this));
    };

    checkError(e) {
        if(e.errno && networkErrors.includes(e.errno)) {
            console.log(new Date().toISOString(), "we have to reconnect");
            
            // close port
            this.client.close();
            
            // re open client
            this.client = new ModbusRTU();
            this.timeoutConnectRef = setTimeout(this.connect.bind(this), 0);
        }
    };
    
};

var devices = [];
devices = devices_model.get_devices();
//console.log(JSON.stringify(devices));

var current_data = [];
current_data = datalogger_model.get_current_data();

var sensors = [];
var modbus_clients = [];


devices.forEach(async (device, index)=> {
    var client = new DataloggerRuntime(device.modbus.address, device.client.ip, device.modbus.port, index);
    client.connect();
    //modbus_clients.push(client);


    device.installations.forEach(async installation => {
        if (sensors.map((sensor) => sensor.id).indexOf(installation.equipment) === -1) {
            let data_sensor = {};
            data_sensor.id = installation.equipment;
            data_sensor.prev_code = installation.previous_code;
            data_sensor.data = {};
            let result_data = current_data.find(x => x.id === data_sensor.id)
            if (result_data.data)
                data_sensor.data = result_data.data;
            data_sensor.code = result_data.code;
            sensors.push(data_sensor);
        }
    });
});

function register_data(index, data){
    if(Number.isInteger(index) && Array.isArray(data)){
        //console.log(new Date().toISOString());
        //console.log(devices[index].device.id);
        //console.log(JSON.stringify(data));
        console.log(`${devices[index].device.id} - ${JSON.stringify(data)}`);        
        for (let i = 0; i < data.length; i += 2) {
            let current_time = Math.floor(new Date().getTime() / 1000.0);
            let measurement = {};
            measurement.humd = data[i] / 10;
            measurement.temp = data[i + 1] / 10;
            measurement.time = current_time;
            let installation = devices[index].installations[Math.floor(i / 2)];
            if (installation) {
                let sensor_find = sensors.find(sensor => sensor.id === installation.equipment);
                if (sensor_find) {
                    sensor_find.data.humd = measurement.humd;
                    sensor_find.data.temp = measurement.temp;
                    sensor_find.data.time = measurement.time;
                    if (!sensor_find.data.hmax) sensor_find.data.hmax = sensor_find.data.humd;
                    if (!sensor_find.data.hmin) sensor_find.data.hmin = sensor_find.data.humd;
                    if (!sensor_find.data.tmax) sensor_find.data.tmax = sensor_find.data.temp;
                    if (!sensor_find.data.tmin) sensor_find.data.tmin = sensor_find.data.temp;
                }
            }
        }
    }
}


/*
modbus_clients.forEach((client, index) => {
    setInterval(function () {
        client.readInputRegisters(ADDRESS_MODBUS_DATALOGGER, 16, function (error, register) {
            if (error) {
                checkError(error, index);
            }
            else {
                console.log(JSON.stringify(register.data));
                for (let i = 0; i < register.data.length; i += 2) {
                    let current_time = Math.floor(new Date().getTime() / 1000.0);
                    let measurement = {};
                    measurement.humd = register.data[i] / 10;
                    measurement.temp = register.data[i + 1] / 10;
                    measurement.time = current_time;
                    let installation = devices[index].installations[Math.floor(i / 2)];
                    if (installation) {
                        let sensor_find = sensors.find(sensor => sensor.id === installation.equipment);
                        if (sensor_find) {
                            sensor_find.data.humd = measurement.humd;
                            sensor_find.data.temp = measurement.temp;
                            sensor_find.data.time = measurement.time;
                            if (!sensor_find.data.hmax) sensor_find.data.hmax = sensor_find.data.humd;
                            if (!sensor_find.data.hmin) sensor_find.data.hmin = sensor_find.data.humd;
                            if (!sensor_find.data.tmax) sensor_find.data.tmax = sensor_find.data.temp;
                            if (!sensor_find.data.tmin) sensor_find.data.tmin = sensor_find.data.temp;
                        }
                    }
                }
            }
        });
        //console.log(sensors);
    }, 2000);
});*/

//console.log(JSON.stringify(current_data));



/*
var sensors = [];
var modbus_clients = [];
var runtime_services = [];
var timeout_run_ref = [];
var timeout_connect_ref = [];

devices.forEach(async device => {
    let client = new ModbusRTU();
    client.setID(device.modbus.address);
    client.connectTCP(device.client.ip, { port: device.modbus.port });
    modbus_clients.push(client);

    timeout_run_ref.push(null);
    timeout_connect_ref.push(null);
    device.installations.forEach(async installation => {
        if (sensors.map((sensor) => sensor.id).indexOf(installation.equipment) === -1) {
            let data_sensor = {};
            data_sensor.id = installation.equipment;
            data_sensor.prev_code = installation.previous_code;
            data_sensor.data = {};
            let result_data = current_data.find(x => x.id === data_sensor.id)
            if (result_data.data)
                data_sensor.data = result_data.data;
            data_sensor.code = result_data.code;
            sensors.push(data_sensor);
        }
    });
});

function checkError(error, index) {
    if (error.errno && networkErrors.includes(error.errno)) {
        console.log(new Date().toISOString(), "we have to reconnect");
        // close port
        modbus_clients[index].close();
        // re open client
        modbus_clients[index] = new ModbusRTU();
        modbus_clients[index].setID(devices[index].modbus.address);
        modbus_clients[index].connectTCP(devices[index].client.ip, { port: devices[index].modbus.port })
        .then()
        .then(function() {
            devices[index].connected = true;
            console.log(new Date().toISOString(), "Connected"); 
        })
        .catch(function(e){});
    }
}

modbus_clients.forEach((client, index) => {
    setInterval(function () {
        client.readInputRegisters(ADDRESS_MODBUS_DATALOGGER, 16, function (error, register) {
            if (error) {
                checkError(error, index);
            }
            else {
                console.log(JSON.stringify(register.data));
                for (let i = 0; i < register.data.length; i += 2) {
                    let current_time = Math.floor(new Date().getTime() / 1000.0);
                    let measurement = {};
                    measurement.humd = register.data[i] / 10;
                    measurement.temp = register.data[i + 1] / 10;
                    measurement.time = current_time;
                    let installation = devices[index].installations[Math.floor(i / 2)];
                    if (installation) {
                        let sensor_find = sensors.find(sensor => sensor.id === installation.equipment);
                        if (sensor_find) {
                            sensor_find.data.humd = measurement.humd;
                            sensor_find.data.temp = measurement.temp;
                            sensor_find.data.time = measurement.time;
                            if (!sensor_find.data.hmax) sensor_find.data.hmax = sensor_find.data.humd;
                            if (!sensor_find.data.hmin) sensor_find.data.hmin = sensor_find.data.humd;
                            if (!sensor_find.data.tmax) sensor_find.data.tmax = sensor_find.data.temp;
                            if (!sensor_find.data.tmin) sensor_find.data.tmin = sensor_find.data.temp;
                        }
                    }
                }
            }
        });
        //console.log(sensors);
    }, 2000);
});*/

const runtime_minute = schedule.scheduleJob("*/1 * * * *", async function () {
    sensors.forEach(sensor => {
        if (sensor.data.hasOwnProperty('time') && sensor.data.hasOwnProperty('temp') && sensor.data.hasOwnProperty('humd')) {
            let current_time = Math.floor(new Date().getTime() / 1000.0);
            if ((Math.abs(sensor.data.time - current_time) < 5)) {
                if (moment(new Date(sensor.data.time * 1000)).format('YYYYMMDD') != moment(new Date(current_time * 1000)).format('YYYYMMDD')) {
                    sensor.data.hmax = sensor.data.hmin = sensor.data.humd;
                    sensor.data.tmax = sensor.data.tmin = sensor.data.temp;
                }
                sensor.data.time = current_time;
                //sensor.data.code = sensor.code;
                sensor.data.hmax = Math.max(sensor.data.humd, sensor.data.hmax);
                sensor.data.hmin = Math.min(sensor.data.humd, sensor.data.hmin);
                sensor.data.tmax = Math.max(sensor.data.temp, sensor.data.tmax);
                sensor.data.tmin = Math.min(sensor.data.temp, sensor.data.tmin);

                //sensor.data.hreg = helpers.timeago(current_time * 1000);
                sensor.data.hreg = moment(new Date(current_time * 1000)).format('HH:mm:ss DD/MM/YYYY');
                // TermohigrometriaNET_v4
                datalogger_model.save_current_data(sensor.id, sensor.code, sensor.data);
                sendRequest('10.0.103.3', 4000, '/termohigrometria/enlace', 'POST', JSON.stringify({ code: sensor.code, data: sensor.data }));

                // TermohigrometriaNET_V3
                let data_request = `id=${sensor.prev_code}&temperatura=${sensor.data.temp}&humedad=${sensor.data.humd}`;
                request_data(data_request);
            }
        }
    }); //console.log();
});

const runtime_hour = schedule.scheduleJob("* 1 * * *", function () {
    console.log('The answer to life, the universe, and everything!');
});

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function sendRequest(hostname, port, path, method, data) {
    let request = http.request(
        {
            hostname,
            port,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }, res => {
            //console.log(`statusCode: ${res.statusCode}`);
            //console.log(`url: ${res.url}`);
        }
    );
    request.write(data);
    request.end();
}

function request_data(data) {
    let request = http.request(
        {
            hostname: '192.168.70.254',
            port: 8080,
            path: `/THM/enlaceNET3.php?${data}`,
            method: 'GET'
        }, res => {
            //console.log(`statusCode: ${res.statusCode}`);
            //console.log(`url: ${res.url}`);
        }
    );
    request.end();
}
