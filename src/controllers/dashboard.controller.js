//import {getLocations} from '../models/locations.js'
import Facilities from "../models/facilities.js";
const facilities = new Facilities();

const dashboardCtrl = {};

const navigate = {dashboard:true};

dashboardCtrl.monit = async function(req, res) {
    const zonas = await facilities.getTreeLocations();
    //console.log(zonas);
    //console.log(req.user.id);
    res.render('dashboard/index.hbs', {zonas, navigate});
};

export default dashboardCtrl;