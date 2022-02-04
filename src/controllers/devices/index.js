import pool from "../../database.js";

const devicesCtrl = {};

devicesCtrl.list = function(req,res){
    res.render('admin/devices/list.hbs');
};

export default devicesCtrl;