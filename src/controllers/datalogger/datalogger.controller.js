import Datalogger from "../../models/datalogger.js";

const datalogger = new Datalogger();

const dataloggerCtrl = {};

const navigate = {datalogger:true};

dataloggerCtrl.list = async function(req,res){
    let dataloggers = await datalogger.list_dataloggers_by_user_id(req.user.id);   
    res.render('datalogger/index.hbs', {navigate, dataloggers});
};

dataloggerCtrl.sensor = async function(req,res){
    res.render('datalogger/sensor.hbs', {navigate});
};

export default dataloggerCtrl;