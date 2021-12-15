const adminCtrl = {};
import Facilities from "../models/facilities.js";
const facilities = new Facilities();


adminCtrl.renderIndex = function (req, res, next) {
    res.render('admin/index.hbs');
};

adminCtrl.renderFacilities = function(req,res){
    let total={}
    total.locations = facilities.getTotalLocations();
    total.equipments = facilities.getTotalEquipments();
    res.render('admin/facilities/facilities.hbs', {total});
}
export default adminCtrl;