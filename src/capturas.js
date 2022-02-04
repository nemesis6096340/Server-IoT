import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import http from 'http';

// -> Path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var capture = {
    "units":
        [
            { 'id': 0, 'unit': 'g', 'description': 'gramos' },
            { 'id': 1, 'unit': 'kg', 'description': 'kilogramos' }
        ],
    "balances":
        [
            { 'id': 565, 'code': 'PES-565', 'unit': 0, 'time': 0, 'net': 0, 'tare': 0, 'gross': 0, 'settings': 2, 'enable': 1, 'interval': 60, 'loger': 0, 'delete': 0 },
            { 'id': 506, 'code': 'PES-506', 'unit': 0, 'time': 0, 'net': 0, 'tare': 0, 'gross': 0, 'settings': 0, 'enable': 1, 'interval': 60, 'loger': 0, 'delete': 0 },
            { 'id': 658, 'code': 'PES-658', 'unit': 0, 'time': 0, 'net': 0, 'tare': 0, 'gross': 0, 'settings': 1, 'enable': 1, 'interval': 60, 'loger': 0, 'delete': 0 },
            { 'id': 557, 'code': 'PES-557', 'unit': 0, 'time': 0, 'net': 0, 'tare': 0, 'gross': 0, 'settings': 2, 'enable': 1, 'interval': 60, 'loger': 0, 'delete': 0 }
        ],
    "filters":
        [
            { 'id': 0, 'match': '', 'enable': 0, 'flag': 1 },
            { 'id': 1, 'match': '^(ST, ........  g)', 'enable': 1, 'flag': 1 },// 658
            { 'id': 2, 'match': '(........g NET\r\n)', 'enable': 1, 'flag': 0 },// 557
            { 'id': 3, 'match': '(....... g T\r\n)', 'enable': 1, 'flag': 0 },// 557
            { 'id': 4, 'match': '(........g\r\n)', 'enable': 1, 'flag': 1 },// 557
        ],
    "commands":
        [
            { 'id': 0, 'ask': '', 'enable': 0 }
        ],
    "ports": [],
    "settings":
        [
            { 'id': 0, 'tittle': '', 'description': '', 'port': 0, 'filter_value': 0, 'filter_net': 0, 'filter_tare': 0, 'filter_gross': 0, 'filter_unit': 0, 'filter_unstable': 0, 'command_get_interval': 1000, 'command_get_net': 0, 'command_get_tare': 0, 'command_get_gross': 0, 'command_set_zero': 0, 'command_set_tare': 0 },
            { 'id': 1, 'tittle': '658', 'description': '', 'port': 0, 'filter_value': 0, 'filter_net': 0, 'filter_tare': 0, 'filter_gross': 1, 'filter_unit': 0, 'filter_unstable': 0, 'command_get_interval': 1000, 'command_get_net': 0, 'command_get_tare': 0, 'command_get_gross': 0, 'command_set_zero': 0, 'command_set_tare': 0 },
            { 'id': 2, 'tittle': '557', 'description': '', 'port': 0, 'filter_value': 0, 'filter_net': 2, 'filter_tare': 3, 'filter_gross': 4, 'filter_unit': 0, 'filter_unstable': 0, 'command_get_interval': 1000, 'command_get_net': 0, 'command_get_tare': 0, 'command_get_gross': 0, 'command_set_zero': 0, 'command_set_tare': 0 }
        ]
};
var data = {};
//

const app = express();

// Settings
app.set('port', 3000);

// Middlewares

// -> Los datos recibidos son convertimos en objetos de javascript
//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

app.get('/captura/fbus', function (req, res) {
    //console.log(req.body);
    //console.log(req.query);

    console.log(req.connection.remoteAddress.split(':').pop());
    let obj = req.query;
    //res.send(data);
    console.log(Math.floor(new Date().getTime() / 1000.0));
    console.log(obj);
    //let obj = JSON.parse(data);

    let index = capture.balances.findIndex(x => x.id === parseInt(obj.id, 10))
    //console.log(index);

    if (index != -1) {
        var match = new Object();
        match.value = obj.rx.match(new RegExp("[-+.0-9]", "g"));

        let index_settings = capture.settings.findIndex(x => x.id === capture.balances[index].settings);
        //console.log(index_settings);
        if (index_settings != -1) {
            var filter = capture.settings[index_settings];
            //console.log(filter);

            if (capture.filters[filter.filter_value].enable) {
                match.value = obj.rx.match(new RegExp(capture.filters[filter.filter_value].match, "g"));
                //console.log(new RegExp(filter.value.match,"g")); 
                //console.log(match.value);
            }
            if (match.value != null) {

                var value = parseFloat(match.value.join(''));
                //console.log(value);
                //console.log(capture.filters[filter.filter_tare].match);
                match.net = obj.rx.match(new RegExp(capture.filters[filter.filter_net].match, "g"));
                match.tare = obj.rx.match(new RegExp(capture.filters[filter.filter_tare].match, "g"));
                match.gross = obj.rx.match(new RegExp(capture.filters[filter.filter_gross].match, "g"));
                //console.log(match.tare);
                if (capture.filters[filter.filter_net].enable && match.net != null) {
                    capture.balances[index].net = value;
                } else if (capture.filters[filter.filter_tare].enable && match.tare != null) {
                    capture.balances[index].tare = value;
                } else if (capture.filters[filter.filter_gross].enable && match.gross != null) {
                    capture.balances[index].gross = value;
                    if (capture.filters[filter.filter_gross].flag) {
                        capture.balances[index].tare = 0;
                        capture.balances[index].net = capture.balances[index].gross;
                    }
                    //if (capture.balances[index].net == 0 || capture.balances[index].tare == 0)
                    //    capture.balances[index].net = capture.balances[index].gross;
                } else if (!capture.filters[filter.filter_value].enable) {
                    capture.balances[index].net = value;
                    capture.balances[index].tare = 0;
                    capture.balances[index].gross = value;
                }
                if (!capture.filters[filter.filter_net].enable) capture.balances[index].net = capture.balances[index].gross - capture.balances[index].tare;
                //if(!filter.tare.enable)     capture[index].data.tare  = capture[index].data.gross - capture[index].data.net;
                if (!capture.filters[filter.filter_tare].enable) capture.balances[index].tare = 0;
                if (!capture.filters[filter.filter_gross].enable) capture.balances[index].gross = capture.balances[index].net + capture.balances[index].tare;

                capture.balances[index].time = Math.floor(new Date().getTime() / 1000.0);
                //console.log(JSON.stringify(capture.balances[index]));

                let data = {};
                data.id = capture.balances[index].code;
                data.net = capture.balances[index].net;
                data.tare = capture.balances[index].tare;
                data.gross = capture.balances[index].gross;
                let index_unit = capture.units.findIndex(x => x.id === capture.balances[index].unit);
                data.unit = capture.units[index_unit].unit;
                data.time = capture.balances[index].time;
                console.log(JSON.stringify(data));

                if (data.gross === 0) {
                    data.net = 0;
                    data.tare = 0;
                }

                if (data.net + data.tare !== data.gross) {
                    data.net = data.gross;
                    data.tare = 0;
                }

                let output = new TextEncoder().encode(
                    JSON.stringify(data)
                );
                fs.writeFile('/mnt/pesaje/' + capture.balances[index].code + ".txt", JSON.stringify(data), function (err) {
                    if (err) return console.log(err);
                    //console.log('write successfully');
                });

                const request = http.request(
                    {
                        hostname: '10.0.103.3',
                        port: 4000,
                        path: '/capture/enlace',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': output.length
                        }
                    }, res => {
                        console.log(`statusCode: ${res.statusCode}`)
                        /*res.on('data', d => {
                            process.stdout.write(d)
                        });*/
                    }
                );
                request.write(output);
                request.end();
                //s.writeFile('//srvwinsap/pesaje/' + capture.balances[index].code + ".txt", JSON.stringify(capture.balances[index]), function (err) {
                //    if (err) return console.log(err);
                //console.log('write successfully');
                //});

                //fs.writeFile('//172.16.10.165/pesaje/'+capture[index].data.id+".txt", JSON.stringify(capture[index].data), function (err) {
                //if (err) return console.log(err);
                //});
            }
        }

    }

    res.end();
    //console.log(find.settings.filter);    
});

app.listen(app.get("port"), function () {
    console.log("Server on port", app.get("port"));
});
