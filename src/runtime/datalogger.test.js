import ModbusRTU from "modbus-serial";
import schedule from 'node-schedule';
import moment from 'moment';
import http from 'http';

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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ADDRESS_MODBUS_DATALOGGER = 7;
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
                console.log( new Date().toISOString(), e.message, e.errno);
                this.checkError(e).bind(this);
            }.bind(this));
    };

    setClient() {
        // set the client's unit id
        // set a timout for requests default is null (no timeout)
        this.client.setID(this.id);
        this.client.setTimeout(10000);
        console.log("Set Client");
        // run program
        this.run();
    };

    async run() {
        // clear pending timeouts
        clearTimeout(this.timeoutRunRef);
    
        // read the 4 registers starting at address 5
        await sleep(200); 

        this.client.readHoldingRegisters(ADDRESS_MODBUS_DATALOGGER, 2)
            .then(function(d) {
                //console.log(new Date().toISOString(), "Receive:", d.data);
            
                register_data(this.index, d.data);
            }.bind(this))
            .then(function() {
                this.timeoutRunRef = setTimeout(this.run.bind(this), 2000);
            }.bind(this))
            .catch(function(e) {
                this.checkError(e);
                console.log(sensors[this.index].id,new Date().toISOString(), e.message, e.errno); 
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
var devices = [
    {modbus:{address:1, port:123}, client:{ip:'10.0.1.98'}}, {modbus:{address:2, port:123}, client:{ip:'10.0.1.98'}},
    {modbus:{address:1, port:123}, client:{ip:'10.0.5.98'}}, {modbus:{address:2, port:123}, client:{ip:'10.0.5.98'}}, {modbus:{address:3, port:123}, client:{ip:'10.0.5.98'}}
];
console.log(devices);
var sensors = [
    {id:'THM971', temp:0, humd:0, time:0}, {id:'THM972', temp:0, humd:0, time:0},
    {id:'THM951', temp:0, humd:0, time:0}, {id:'THM952', temp:0, humd:0, time:0}, {id:'THM953', temp:0, humd:0, time:0}
];

devices.forEach(async (device, index)=> {
    console.log(JSON.stringify(device));
    console.log(JSON.stringify(index));
    var client = new DataloggerRuntime(device.modbus.address, device.client.ip, device.modbus.port, index);
    client.connect();    
});

function register_data(index, data){
    if(Number.isInteger(index) && Array.isArray(data)){
        console.log(`${sensors[index].id} ${JSON.stringify(data)}`);
        //console.log(JSON.stringify(data));
        for (let i = 0; i < data.length; i += 2) {
            let current_time = Math.floor(new Date().getTime() / 1000.0);
            sensors[index].temp = data[i] / 10;
            sensors[index].humd = data[i + 1] / 10;
            sensors[index].time = current_time;      
        }
    }
}

/*const ADDRESS_MODBUS_DATALOGGER = 7;

var client = new ModbusRTU();


client.setTimeout(5000);
client.connectTCP('10.0.1.98', { port: 123 });

var sensors = [{id:'THM971', temp:0, humd:0}, {id:'THM972', temp:0, humd:0}];
console.log(JSON.stringify(sensors));

var id = 0;
setInterval(() => {
    id = (id % 2) + 1
    client.setID(id);
    client.readHoldingRegisters(ADDRESS_MODBUS_DATALOGGER, 3)
            .then(function(d) {                
                console.log(new Date().toISOString(), "Receive:", d.data);
                //sensors[id-1].temp = d.data[0]/10;
                //sensors[id-1].humd = d.data[1]/10;
                sensors[id-1].temp = d.data[0]/10;
                sensors[id-1].humd = d.data[1]/10;
                //console.log(sensors[id-1]);
                })
            .then(function() {
                console.log("Id: " + id);
            })        
            .catch(function(e) {
                console.log("Error...");
                console.log(new Date().toISOString(), e.message);
                this.checkError(e);
            });
}, 1000);*/

const runtime_minute = schedule.scheduleJob("*/1 * * * *", function () {
    sensors.forEach(sensor => {
            let current_time = Math.floor(new Date().getTime() / 1000.0);
                // TermohigrometriaNET_V3
                let data_request = `id=${sensor.id}&temperatura=${sensor.temp}&humedad=${sensor.humd}`;
                console.log(data_request);
                request_data(data_request);
            
    }); //console.log();
});

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