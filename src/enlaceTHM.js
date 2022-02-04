import express from "express";
import pool from "./databaseTHM.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// -> Path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Settings
app.set('port', 3001);

// Middlewares
// -> Los datos recibidos son convertimos en objetos de javascript
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/enlaceJSON', async function (req, res) {

    let { result } = req.query;
    console.log(result);
    let data = await decodificarQuery(result);
    //console.log(data);
    res.end(data.replaceAll('T04:00:00.000Z', ''));
});

app.post('/enlaceJSON', async function (req, res) {
    /*
        let { result } = req.query;
    
        console.log(result);
        let data = await decodificarQuery(result);
        //console.log(data);
        res.end(data.replaceAll('T04:00:00.000Z',''));
        //console.log(find.settings.filter);    
        */
    console.log(req.body);
    res.end();
});

app.get('/datalogger', async function (req, res) {
    let { id, temperatura, humedad } = req.query;
    console.log(req.query);
    res.end();
});

app.listen(app.get("port"), function () {
    console.log("Server on port", app.get("port"));
});

var _STID, _HREG, _HINI, _HFIN, _FREC;
var _TMED, _TRAN, _ERRH, _ERRT, _MAXT, _MINT, _MAXH, _MINH;

async function decodificarQuery(strQuery) {
    let i = 0, pos = 0;
    let index = -1, iniStr = 0, finStr = 0;
    let strDecodificar = "", parametroRecibido = "";
    let comando = "", parametro = "";

    finStr = strQuery.indexOf("|", iniStr);
    let id = strQuery.substr(iniStr, finStr);
    //console.log(id);

    //echo $id."<br>";
    index = finStr;
    let output = "";

    if (strQuery.lastIndexOf("|") !== -1) {
        while (index != strQuery.lastIndexOf("|")) {
            iniStr = index + 1;
            finStr = strQuery.indexOf("|", index + 1);
            parametroRecibido = strQuery.substr(iniStr, finStr - iniStr);
            console.log(parametroRecibido);

            index = finStr;
            if (parametroRecibido.lastIndexOf("~") !== -1) {
                let index_ini = parametroRecibido.indexOf("~");
                let index_fin = parametroRecibido.lastIndexOf("~");
                if ((index_ini !== -1) && (index_ini == index_fin)) {
                    comando = parametroRecibido.substr(0, index_ini);
                    parametro = parametroRecibido.substr(index_fin + 1);
                    if (comando !== "" && parametro !== "") {
                        //console.log(`comando: ${comando}, parametro: ${parametro}`);
                        output = await verificarParametros(id, comando, parametro);
                    }
                }
            }
        }
    }
    return output;
}

async function verificarParametros(_id, _comando, _parametro) {

    _STID = _id;
    let output = "";
    let result;
    switch (_comando) {
        case "HREG":
            _HREG = _parametro;
            break;
        case "HINI":
            _HINI = _parametro;
            break;
        case "HFIN":
            _HFIN = _parametro;
            break;
        case "FREC":
            _FREC = _parametro;
            break;

        case "TMED":
            _TMED = _parametro;
            break;
        case "TRAN":
            _TRAN = _parametro;
            break;
        case "ERRH":
            _ERRH = _parametro;
            break;
        case "ERRT":
            _ERRT = _parametro;
            break;
        case "MAXT":
            _MAXT = _parametro;
            break;
        case "MINT":
            _MINT = _parametro;
            break;
        case "MAXH":
            _MAXH = _parametro;
            break;
        case "MINH":
            _MINH = _parametro;
            break;

        case "JSON":
            switch (_parametro) {
                case "UASI":
                    result = await pool.query("call mostrarUbicacionSensor();");
                    result = JSON.parse(JSON.stringify(result));
                    output = JSON.stringify(result[0]);
                    break;
                case "GDMO":
                    result = await pool.query("call getDataloggerMonitoreo(?);", _STID);
                    result = JSON.parse(JSON.stringify(result));
                    output = JSON.stringify(result[0]);
                    break;

                case "GDME":
                    //getDataloggerMediciones($_STID, $_HREG, $_FREC);
                    //console.log("call getDataloggerMediciones(?,?,?);",[_STID,_HREG,60]);
                    result = await pool.query("call getDataloggerMediciones(?,?,?);", [_STID, _HREG, _FREC]);
                    result = JSON.parse(JSON.stringify(result));
                    output = JSON.stringify(result[0]);
                    break;
                case "GAGG":
                    //getAggregateMediciones($_STID, $_HREG, $_FREC);
                    result = await pool.query("call getAggregateMediciones(?,?,?);", [_STID, _HREG, _FREC]);
                    result = JSON.parse(JSON.stringify(result));
                    output = JSON.stringify(result[0]);
                    break;
                case "GAGR":
                    //getAggregateReporte($_STID, $_HINI, $_HFIN, $_FREC);
                    result = await pool.query("call getAggregateReporte(?,?,?,?);", [_STID, _HINI, _HFIN, _FREC]);
                    result = JSON.parse(JSON.stringify(result));
                    output = JSON.stringify(result[0]);
                    break;
                case "GDRE":
                    //getDataloggerReporte($_STID, $_HINI, $_HFIN, $_FREC);
                    result = await pool.query("call getDataloggerReporte(?,?,?,?);", [_STID, _HINI, _HFIN, _FREC]);
                    result = JSON.parse(JSON.stringify(result));
                    output = JSON.stringify(result[0]);
                    break;
                case "GHRE":
                    //getHistorialReporte($_STID, $_HINI, $_HFIN, $_FREC);
                    result = await pool.query("call getHistorialReporte(?,?,?,?);", [_STID, _HINI, _HFIN, _FREC]);
                    result = JSON.parse(JSON.stringify(result));
                    output = JSON.stringify(result[0]);
                    break;
                case "GALD":
                    result = await pool.query("call getAlarmFechas(?);", _STID);
                    result = JSON.parse(JSON.stringify(result));
                    output = JSON.stringify(result[0]);
                    break;

                case "GALR":
                    //getAlarmMediciones($_STID, $_HINI, $_HFIN);
                    //getAlarmMediciones($_STID, $_HREG, $_FREC);
                    result = await pool.query("call getAlarmMediciones(?,?,?);", [_STID, _HREG, _FREC]);
                    result = JSON.parse(JSON.stringify(result));
                    output = JSON.stringify(result[0]);
                    break;

                /*
                                case "AJUS":					
                                    //getConfiguracionAjustes();
                                    result = await pool.query("call getConfiguracionAjustes();");
                                    result = JSON.parse(JSON.stringify(result));
                                    output = JSON.stringify(result[0]);
                                    break; 
                */
                /*
                case "UPDT":					
                    updateConfiguracionAjustes($_STID, $_TMED, $_TRAN,$_ERRT,$_ERRH, $_MAXH,$_MINH,$_MAXT,$_MINT);
                    break;
                    */
            }
            break;
    }
    return output;
}
