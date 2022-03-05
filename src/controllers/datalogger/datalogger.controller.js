import app from "../../app.js";
import Datalogger from "../../models/datalogger.js";
import moment from 'moment';

const datalogger = new Datalogger();

const dataloggerCtrl = {};

const navigate = {datalogger:true};

dataloggerCtrl.link = function(req, res){
    let {code, data} = req.body;
    let measurement = {};
    measurement = data;
    measurement.code = code;
    app.get('io').emit('datalogger:data', measurement);    
    res.end("OK");
}

dataloggerCtrl.list = async function(req,res){
    let dataloggers = await datalogger.list_dataloggers_by_user_id(req.user.id); 
   //console.log(JSON.stringify(dataloggers));
    res.render('datalogger/index.hbs', {navigate, dataloggers});
};

dataloggerCtrl.sensor = async function(req,res){
    let sensor = {};
    let {id, date} = req.query;
    sensor.code = id;    
    let sensor_id = Number(sensor.code.match(/(\d){4}$/g)[0].trim()) *1000;
    let current_date = new Date();
    if(date){
        current_date = moment(date, 'YYYY-MM-DD').toDate();
    }
    else{
        current_date = new Date();
    }
    current_date.setHours(0);
    current_date.setMinutes(0);
    current_date.setSeconds(0);
    sensor.date = moment(current_date).format('YYYY-MM-DD'); 
    let current_time = Math.floor(current_date.getTime() / 1000.0);
    sensor.date_from = current_time * 1000;
    sensor.date_to = (current_time + 3600 * 24)*1000;
    console.log(current_time);

    let data = await datalogger.get_history_of_measurements(sensor_id, current_time, current_time + 3600 * 24);
    res.render('datalogger/sensor.hbs', {navigate, sensor, data});
};

export default dataloggerCtrl;