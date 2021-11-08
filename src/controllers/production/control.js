import merge from "deepmerge";
import app from "../../app.js";
import pool from "../../database.js";
import * as helpers from "../../lib/helpers.js";
const links = {
    path: "/produccion/enlace",
};

var state = {};
var counters = [];

load();

function load() {
    const result = pool.querySync("select * from db_ControldeProduccion_V4.mostrarContadores;");
    const data = JSON.parse(JSON.stringify(result));
    data.forEach(function (element) {
        element.data = JSON.parse(element.data);
    });
    counters = data;
    //console.log(counters);

    const resultState = pool.querySync("select * from db_ControldeProduccion_V4.EstadosProduccion;");
    state = JSON.parse(JSON.stringify(resultState));
    //console.log(state);    
};

function showData(counter) {
    //console.log(JSON.stringify(counter));
    let output = {};
    let html = ''
    output.id = counter.id;
    let hres = '';
    if (counter.data.count.hres != 0)
        hres = '... reseteado '+ helpers.timeago(counter.data.count.hres * 1000);
    let hreg = '';
    if (counter.data.state.hreg != 0)
        hreg = '... ' + helpers.timeago(counter.data.state.hreg * 1000);
    let status = state.find(x => x.id === counter.data.state.iest).detalle;
    //'<td><h5>' + counter.data.count.turn + '</h5><br><small> ...reseteado ' + hres + '</small>' + '</td>' +
    html = '<td><img src="/img/' + counter.code + '.png" class="img-fluid img-thumbnail"></img><br><small>' + counter.equipment + '</small>' + '</td>' +
        '<td>' + counter.data.count.total + '</td>' +
        '<td><div class="item">' + counter.data.count.turn + '<span class="notify-badge">' + hres + '</span></div></td>' +
        '<td><div class="item">' + (counter.data.count.total - counter.data.count.previous) + '<span class="notify-badge">' + counter.data.count.hour + '</span></div></td>' +
        '<td>' + counter.data.speed.machine + '</td>' +
        '<td><div class="item">' + status + '<span class="notify-badge">' + hreg + '</span></div></td>'
        ;
    output.html = html;
    //console.log(JSON.stringify(output));
    app.get('io').emit('server:data', output);
}

console.log(JSON.stringify(counters));
console.log(JSON.stringify(state));



const controlCtrl = {};

controlCtrl.logger = function (req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
    //console.log(JSON.stringify(data));
    var counter = counters.find(x => x.id === data.id);
    if (counter) {
        //TOTAL, RESET, LAP,  EVENT,  NEW,  START,  FINISH, RESTART
        if (data.hasOwnProperty('count') || data.hasOwnProperty('production') || data.hasOwnProperty('state')) {

            //let counter = counters.find(x => x.id === data.id);
            //if (counter) {
                counter.data = data;
                showData(counter);
                if (data.hasOwnProperty('count') && data.hasOwnProperty('speed')) {
                    pool.query("call db_ControldeProduccion_V4.actualizarConteoActual(?,?,?,?,?,?,?,?,?);",
                        [data.id, data.count.incr, data.count.total, data.count.previous, data.count.turn, data.count.hour, data.count.max, data.count.min, data.speed.machine]);
                }
            //}
            //res.status(200).send({ok:200}).send('\r\n');
            //console.log(counters.find(x => x.id === data.id).data);
        }
        if (data.hasOwnProperty('reset')) {
            console.log('[--- Conteo Turno --]');
            pool.query("call db_ControldeProduccion_V4.insertarConteoTurno(?,?,?);", [data.id, data.reset.time, data.reset.turn]);
            //counters.find(x => x.id === data.id).data.count.hres = data.reset.time;
            counter.data.count.hres = data.reset.time;
        }
        if (data.hasOwnProperty('lap')) {
            console.log('[--- Conteo Hora --]');
            pool.query("call db_ControldeProduccion_V4.insertarConteoHora(?,?,?);", [data.id, data.lap.time, data.lap.hour]);
        }
        if (data.hasOwnProperty('event')) {
            console.log('[--- Evento de Produccion --]');
            //console.log(data);
            pool.query("call db_ControldeProduccion_V4.insertarEvento(?,?,?);", [data.id, data.event.time, data.event.state]);
            //counters.find(x => x.id === data.id).data.state.hreg = data.event.time;
            counter.data.state.hreg = data.event.time;
            //counters.find(x => x.id === data.id).data.state.iest = data.event.state;
            counter.data.state.iest = data.event.state;
            app.get('io').emit('server:data', counters.find(x => x.id === data.id).data);
        }
        if (data.hasOwnProperty('new')) {
            console.log('[--- Nueva Produccion --]');
            //console.log(data);
            pool.query("call db_ControldeProduccion_V4.nuevaProduccion(?,?,?);", [data.id, data.new.ipro, data.new.lote]);
            //counters.find(x => x.id === data.id).data.production.ipro = data.new.ipro;
            counter.data.production.ipro = data.new.ipro;
            //counters.find(x => x.id === data.id).data.production.lote = data.new.lote;
            counter.data.production.lote = data.new.lote;
            
        }
        if (data.hasOwnProperty('start')) {
            console.log('[--- Iniciar Produccion --]');
            //console.log(data);
            pool.query("call db_ControldeProduccion_V4.iniciarProduccion(?,?,?,?);", [data.id, data.start.ipro, data.start.time, data.start.incr]);
            //counters.find(x => x.id === data.id).data.count.incr = data.start.incr;
            counter.data.count.incr = data.start.incr;
            //counters.find(x => x.id === data.id).data.production.ipro = data.start.ipro;
            counter.data.production.ipro = data.start.ipro;
            //counters.find(x => x.id === data.id).data.production.hini = data.start.time;
            counter.data.production.hini = data.start.time;

        }
        if (data.hasOwnProperty('finish')) {
            console.log('[--- Finalizar Produccion--]');
            //console.log(data);
            pool.query("call db_ControldeProduccion_V4.finalizarProduccion(?,?,?);", [data.id, data.finish.ipro, data.finish.time]);
            //counters.find(x => x.id === data.id).production.ipro = data.finish.ipro;
            counter.production.ipro = data.finish.ipro;
            //counters.find(x => x.id === data.id).production.hfin = data.finish.time;
            counter.production.hfin = data.finish.time;
        }
        if (data.hasOwnProperty('restart')) {
            console.log('[--- Resetear Produccion--]');
            //console.log(data);
            pool.query("call db_ControldeProduccion_V4.resetearProduccion(?,?);", [data.id, data.restart.ipro]);
            //counters.find(x => x.id === data.id).production.ipro = data.restart.ipro;
            counter.production.ipro = data.restart.ipro;
            //counters.find(x => x.id === data.id).production.lote = '';
            counter.production.lote = '';
            //counters.find(x => x.id === data.id).production.hini = 0;
            counter.production.hini = 0;
            //counters.find(x => x.id === data.id).production.hfin = 0;
            counter.production.hfin = 0;
        }
    }
    else {
        //console.log("No Existe");
    }

};

controlCtrl.list = async function (req, res) {
    //res.send(JSON.stringify(counters));
    res.render('production/current.hbs');

    const result = await pool.query("select distinct area from db_ControldeProduccion_V4.mostrarContadores;");
    const areas = JSON.parse(JSON.stringify(result));
    console.log(areas);

    const io = app.get('io');
    io.on('connection', function (socket) {
        console.log('a user connected ' + socket.id);
        //console.log(areas);
        socket.emit('server:areas', areas);

        socket.emit('server:counters', counters);

        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
};
export default controlCtrl;