import pool from "../database.js";

const db_facilities = "db_EquiposeInfraestructura_V1";
const db_capture = "db_busdecampo_v3";
const db_users = "db_UsuariosySesiones";

import Facilities from "../models/facilities.js";
const facilities = new Facilities();

import Users from "../models/users.js";
const users = new Users();
class Capture {
    
    constructor() {

    };

    /*
    [
        {
            "plant":{"code":"MF", "name": "Planta Miraflores"},
            "areas": [
                {
                    "code":"LE"
                    "name": "Liquidos Esteriles",
                    "locations":[
                        {
                            "code":"LE 01 VB",
                            "name": "Esclusa de Personal",
                            "balances": [
                                {
                                    "code":"LE 1022",
                                    "name":"Sensor...."
                                }
                            ]
                        },
                        {
                            "code":"LE 02 PB",
                            "name": "Preparado",
                            "balances": [
                                {
                                    "code:"LE 1023",
                                    "name":"Sensor...."
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
    */
    async list_capture_by_user_id(id) {
        let list_captures = [];
        let tree_locations = await users.get_tree_locations_by_user_id(id);
        if(tree_locations.length > 0){
            for (let i = 0; i < tree_locations.length; i++) {
                let plant_in_location = tree_locations[i];
                let plant_data = {};
                plant_data.code = plant_in_location.code;
                plant_data.name = plant_in_location.name;
                plant_data.areas = [];
                for( let j = 0; j < plant_in_location.areas.length; j++){
                    let area_in_location = plant_in_location.areas[j];
                    let area_data = {};
                    area_data.code = area_in_location.code;
                    area_data.name = area_in_location.name;
                    area_data.locations = [];
                    let balances_by_area = JSON.parse(JSON.stringify(await pool.query(`SELECT * FROM ${db_capture}.balanzas WHERE area = '${area_data.code}';`)));
                    //let printers_by_area = JSON.parse(JSON.stringify(await pool.query(`SELECT * FROM ${db_capture}.impresoras WHERE area = '${area_data.code}';`)));
                    for (let k = 0; k < area_in_location.locations.length; k++) {
                        let location = area_in_location.locations[k];
                        let location_data = {};
                        location_data.code = location.code;
                        location_data.name = location.name;
                        location_data.balances = [];
                        location_data.printers = [];
                        for (let s = 0; s < balances_by_area.length; s++) {
                            const balance_in_area = balances_by_area[s];
                            let balance_code = facilities.get_equipment_code(balance_in_area.area, balance_in_area.id);
                            if( balance_in_area.ubicacion ===  location.code){
                                if(location_data.balances.map((balance) => balance.code).indexOf(balance_code) === -1){
                                    let data_balance = {};
                                    data_balance.code = balance_code;
                                    data_balance.name = balance_in_area.objeto;
                                    data_balance.data = JSON.parse(balance_in_area.data);
                                    location_data.balances.push(data_balance);
                                }
                            }
                        };
                        if(location_data.balances.length>0){
                            area_data.locations.push(location_data);
                        }
                    }
                    if(area_data.locations.length>0){
                        plant_data.areas.push(area_data);
                    }
                }
                if(plant_data.areas.length>0){
                    list_captures.push(plant_data);
                }
            }            
        }
        return list_captures;
    };
};

export default Capture;