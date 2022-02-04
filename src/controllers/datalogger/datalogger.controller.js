import Datalogger from "../../models/datalogger.js";

const datalogger = new Datalogger();

const dataloggerCtrl = {};

const navigate = {datalogger:true};

dataloggerCtrl.list = async function(req,res){
    let dataloggers = await datalogger.list_dataloggers_by_user_id(req.user.id);
    console.log(dataloggers);
    res.render('datalogger/index.hbs', {navigate, dataloggers});
};

export default dataloggerCtrl;