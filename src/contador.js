import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

import modbus from 'modbus';
import ModbusRTU from "modbus-serial";

var client = new ModbusRTU();
client.connectTCP("10.0.103.23", { port: 1024 });
client.setID(12);

setInterval(function() {
    client.readHoldingRegisters(120, 12, function(err, data) {
        console.log(data.data);
    });
}, 1000);

const modbusIP = modbus('10.0.103.23',1024,12)

// -> Path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.get('/counter', async function(req, res){
    let counter = await modbusIP.read('hr120-132') ;
    res.send(counter);
})

//import control  from "../src/controllers/production/control.js";
app.post('/produccion/enlace',function(req, res){
    console.log(req.body);
});
// Settings
app.set('port', 3002);

app.listen(app.get("port"), function () {
    console.log("Server on port", app.get("port"));
});
