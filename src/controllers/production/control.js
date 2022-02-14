import merge from "deepmerge";
import app from "../../app.js";
import pool from "../../database.js";
import * as helpers from "../../lib/helpers.js";

import schedule from 'node-schedule';
import moment from 'moment';
moment.locale('es');

import Production from "../../models/production.js";
const production = new Production();

const links = {
    path: "/produccion/enlace",
};

const navigate = { production: true };

var state = {};
var counters = [];

load();

function load() {
    const result = pool.querySync("select * from db_ControldeProduccion_V4.mostrarContadores;");
    const data = JSON.parse(JSON.stringify(result));
    data.forEach(function (element) {
        element.data = JSON.parse(element.data);
        console.log(element.data);
    });
    counters = data;
    console.log (counters);
    const resultState = pool.querySync("select * from db_ControldeProduccion_V4.EstadosProduccion;");
    state = JSON.parse(JSON.stringify(resultState));    
};

function showData(counter) {
    //console.log(JSON.stringify(counter));
    let data = {};
    data.id = counter.id;
    data.total = counter.data.count.total;
    data.turn = counter.data.count.turn;
    data.speed = counter.data.speed.machine;
    data.hour = counter.data.count.hour;
    data.hour_current = counter.data.count.total - counter.data.count.previous;
    if (counter.data.count.hres != 0)
        data.hres = '... reseteado ' + helpers.timeago(counter.data.count.hres * 1000);
    else data.hres = '';
    if (counter.data.state.hreg != 0)
        data.hreg = '... ' + helpers.timeago(counter.data.state.hreg * 1000);
    else data.hreg = '';
    data.lote = counter.data.production.lote;
    if (counter.data.production.hini != 0)
        data.hini = moment(new Date(counter.data.production.hini * 1000)).format('HH:mm:ss DD/MM/YYYY');
    else
        data.ini = '--:--:-- --/--/----';
    data.status = state.find(x => x.id === counter.data.state.iest).detalle;

    app.get('io').emit('server:data', data);
}

console.log(JSON.stringify(counters));
console.log(JSON.stringify(state));

const controlCtrl = {};

controlCtrl.logger = function (req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
    console.log(JSON.stringify(data));
    var counter = counters.find(x => x.id === data.id);


    if (counter) {
        try {        //TOTAL, RESET, LAP,  EVENT,  NEW,  START,  FINISH, RESTART
            if (data.hasOwnProperty('count') || data.hasOwnProperty('production') || data.hasOwnProperty('state')) {

                let counter = counters.find(x => x.id === data.id);
                if (counter) {
                    //counter.data = data;
                    if (data.hasOwnProperty('count'))
                        counter.data.count = data.count;
                    if (data.hasOwnProperty('speed'))
                        counter.data.speed = data.speed;
                    if (data.hasOwnProperty('state'))
                        counter.data.state = data.state;
                    if (data.hasOwnProperty('production'))
                        counter.data.production = data.production;
                    if (data)
                        showData(counter);
                    if (data.hasOwnProperty('count') && data.hasOwnProperty('speed')) {
                        pool.query("call db_ControldeProduccion_V4.actualizarConteoActual(?,?,?,?,?,?,?,?,?);",
                            [data.id, data.count.incr, data.count.total, data.count.previous, data.count.turn, data.count.hour, data.count.max, data.count.min, data.speed.machine]);
                    }
                }
                //res.status(200).send({ok:200}).send('\r\n');
                //console.log(counters.find(x => x.id === data.id).data);
            }
            if (data.hasOwnProperty('reset')) {
                console.log('[--- Conteo Turno --]');
                data.reset.time = Math.floor(new Date().getTime() / 1000.0);
                pool.query("call db_ControldeProduccion_V4.insertarConteoTurno(?,?,?);", [data.id, data.reset.time, data.reset.turn]);
                //counters.find(x => x.id === data.id).data.count.hres = data.reset.time;
                counter.data.count.hres = data.reset.time;
                showData(counter);
            }
            if (data.hasOwnProperty('lap')) {
                console.log('[--- Conteo Hora --]');
                pool.query("call db_ControldeProduccion_V4.insertarConteoHora(?,?,?);", [data.id, data.lap.time, data.lap.hour]);
                showData(counter);
            }
            if (data.hasOwnProperty('event')) {
                console.log('[--- Evento de Produccion --]');
                //console.log(data);
                data.event.time = Math.floor(new Date().getTime() / 1000.0);
                pool.query("call db_ControldeProduccion_V4.insertarEvento(?,?,?);", [data.id, data.event.time, data.event.state]);
                //counters.find(x => x.id === data.id).data.state.hreg = data.event.time;
                counter.data.state.hreg = data.event.time;

                //counters.find(x => x.id === data.id).data.state.iest = data.event.state;
                counter.data.state.iest = data.event.state;
                //app.get('io').emit('server:data', counters.find(x => x.id === data.id).data);
                showData(counter);
            }
            if (data.hasOwnProperty('new')) {
                console.log('[--- Nueva Produccion --]');
                //console.log(data);
                pool.query("call db_ControldeProduccion_V4.nuevaProduccion(?,?,?);", [data.id, data.new.ipro, data.new.lote]);
                //counters.find(x => x.id === data.id).data.production.ipro = data.new.ipro;
                counter.data.production.ipro = data.new.ipro;
                //counters.find(x => x.id === data.id).data.production.lote = data.new.lote;
                counter.data.production.lote = data.new.lote;
                showData(counter);
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
                showData(counter);
            }
            if (data.hasOwnProperty('finish')) {
                console.log('[--- Finalizar Produccion--]');
                //console.log(data);
                data.finish.time = Math.floor(new Date().getTime() / 1000.0);
                pool.query("call db_ControldeProduccion_V4.finalizarProduccion(?,?,?);", [data.id, data.finish.ipro, data.finish.time]);
                //counters.find(x => x.id === data.id).production.ipro = data.finish.ipro;
                counter.data.production.ipro = data.finish.ipro;
                //counters.find(x => x.id === data.id).production.hfin = data.finish.time;
                counter.data.production.hfin = data.finish.time;
                showData(counter);
            }
            if (data.hasOwnProperty('restart')) {
                console.log('[--- Resetear Produccion--]');
                console.log(data);
                data.restart.ipro = Math.floor(new Date().getTime() / 1000.0);
                pool.query("call db_ControldeProduccion_V4.resetearProduccion(?,?);", [data.id, data.restart.ipro]);
                //counters.find(x => x.id === data.id).production.ipro = data.restart.ipro;
                counter.data.production.ipro = data.restart.ipro;
                //counters.find(x => x.id === data.id).production.lote = '';
                counter.data.production.lote = '';
                //counters.find(x => x.id === data.id).production.hini = 0;
                counter.data.production.hini = 0;
                //counters.find(x => x.id === data.id).production.hfin = 0;
                counter.data.production.hfin = 0;
                showData(counter);
            }
        } catch (error) {
            console.log();
        }
    }
    else {
        //console.log("No Existe");
    }
    let output = JSON.stringify({ time: Math.floor(new Date().getTime() / 1000.0) });
    //console.log(output);
    res.send(output + '\r\n');
};

controlCtrl.list = async function (req, res) {
    //res.send(JSON.stringify(counters));
    
    //const result = await pool.query("select distinct area from db_ControldeProduccion_V4.mostrarContadores;");
    
    //const areas = JSON.parse(JSON.stringify(result));
    //console.log(areas);
    //console.log(counters);

    const data = await production.list_counters_by_user_id(req.user.id);

    res.render('production/current.hbs', { navigate, counters, data});

    //app.get('io').emit('server:areas', areas);
    app.get('io').emit('server:counters', counters);

    counters.forEach(counter => {
        showData(counter);
    });
};

controlCtrl.data_counter = async function (req, res) {
    //res.send(JSON.stringify(counters));
    let { id } = req.query;
    console.log(id);
    const result = await pool.query("select * from db_ControldeProduccion_V4.produccionActual where contador = ?;", [id]);

    const produccion_actual = JSON.parse(JSON.stringify(result))[0];
    console.log(produccion_actual);

    let data = {};
    let counter = counters.find(x => x.id == id);

    //console.log(counter);

    data = JSON.parse(JSON.stringify(counter));
    data.ipro = produccion_actual.produccion;

    data.hour_current = counter.data.count.total - counter.data.count.previous;
    if (counter.data.count.hres != 0)
        data.hres = '... reseteado ' + helpers.timeago(counter.data.count.hres * 1000);
    else data.hres = '';
    if (counter.data.state.hreg != 0)
        data.hreg = '... ' + helpers.timeago(counter.data.state.hreg * 1000);
    else data.hreg = '';
    data.lote = counter.data.production.lote;
    if (counter.data.production.hini != 0)
        data.hini = moment(new Date(counter.data.production.hini * 1000)).format('HH:mm:ss DD/MM/YYYY');
    else
        data.ini = '--:--:-- --/--/----';
    data.status = state.find(x => x.id === counter.data.state.iest).detalle;

    console.log(data);

    const result_lote = await pool.query("call db_ControldeProduccion_V4.ListarProduccion(?);", [id]);

    let lotes = JSON.parse(JSON.stringify(result_lote[0]));
    console.log(lotes);
    res.render('production/data_counter.hbs', { data, lotes, navigate });

};

controlCtrl.data_lote = async function (req, res) {
    //res.send(JSON.stringify(counters));
    let { id } = req.query;
    console.log(id);

    const result_datos = await pool.query("call db_ControldeProduccion_V4.MostrarProduccion(?);", [id]);
    let produccion_datos = JSON.parse(JSON.stringify(result_datos[0][0]));

    console.log(produccion_datos);

    const result_hora = await pool.query("call db_ControldeProduccion_V4.ListarProduccionHora(?);", [id]);
    let produccion_hora = JSON.parse(JSON.stringify(result_hora[0]));

    const result_turno = await pool.query("call db_ControldeProduccion_V4.ListarProduccionTurno(?);", [id]);
    let produccion_turno = JSON.parse(JSON.stringify(result_turno[0]));

    const result_eventos = await pool.query("call db_ControldeProduccion_V4.ListarProduccionEventos(?);", [id]);
    let produccion_eventos = JSON.parse(JSON.stringify(result_eventos[0]));

    res.render('production/data_lote.hbs', { produccion_datos, produccion_hora, produccion_turno, produccion_eventos, navigate });
};

/*
var j = schedule.scheduleJob('* 1 * * *', function () {  // this for one hour
    console.log('The answer to life, the universe, and everything!');
    pool.query("call db_ControldeProduccion_V4.insertarConteoHora(?,?,?);", [201, Math.floor(new Date().getTime() / 1000.0), data.lap.hour]);
});*/


export default controlCtrl; 0    