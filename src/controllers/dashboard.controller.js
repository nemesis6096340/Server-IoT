//import {getLocations} from '../models/locations.js'
import Facilities from "../models/facilities.js";
const facilities = new Facilities();

import Users from "../models/users.js";
const users = new Users();

const dashboardCtrl = {};

const navigate = {dashboard:true};

dashboardCtrl.monit = async function(req, res) {
    const zonas = await facilities.getTreeLocations();
    const ubicaciones = await users.get_locations_by_user_id(req.user.id);
    //console.log(zonas);
    //console.log(req.user.id);
    res.render('dashboard/index.hbs', {zonas, ubicaciones, navigate});
};

export default dashboardCtrl;