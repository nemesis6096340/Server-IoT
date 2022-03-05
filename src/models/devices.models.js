import pool from "../database.js";

const db_devices = "db_dispositivos_v1";

const conv4 = num => [
    (num >> 24) & 255,
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255,
];
function conv6(x) {
    let y= Math.floor(x/2**32);
    return [(y<<16),(y<<24), x,(x<<8),(x<<16),(x<<24)].map(z=> z>>>24)
}
function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase();
}
function toIpAddress(number){
    let ip = conv4(number);
    return `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3]}`;
}
function toMacAddress(number){
    let ip = conv6(number);
    return `${toHex(ip[0])}:${toHex(ip[1])}:${toHex(ip[2])}:${toHex(ip[3])}:${toHex(ip[4])}:${toHex(ip[5])}`;
}

class Devices{

    get_devices(){
        let devices = [];
        let result_devices = JSON.parse(JSON.stringify(pool.querySync(`SELECT * FROM ${db_devices}.devices;`)));
        let result_installed_devices = JSON.parse(JSON.stringify(pool.querySync(`SELECT * FROM ${db_devices}.installed_devices;`)));        
        
        result_devices.forEach( device => {
            let data = {};
            data.device = {};
            data.device.id = device.device_id;
            data.device.mode = device.device_mode;
            data.device.status = device.device_status;

            data.modbus = {};
            data.modbus.mode = device.modbus_mode;
            data.modbus.address = device.modbus_address;
            data.modbus.baud = device.modbus_baud;
            data.modbus.conf = device.modbus_conf;
            data.modbus.port = device.modbus_port;

            data.client = {};
            data.client.mode = device.client_mode;            
            data.client.mac = toMacAddress(device.client_mac);
            data.client.ip = toIpAddress(device.client_ip);
            data.client.dns = toIpAddress(device.client_dns);
            data.client.gate = toIpAddress(device.client_gate);
            data.client.mask = toIpAddress(device.client_mask);
            data.client.brdc = toIpAddress(device.client_brdc);

            data.installations = [];
            data.installations = result_installed_devices.filter(installed => installed.device === data.device.id);
            data.installations.forEach(function(installed){ delete installed.device });
            devices.push(data);
        });
        return devices;
    }
}

export default Devices;