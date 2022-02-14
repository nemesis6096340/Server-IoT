import pool from "../database.js";

const db_facilities = "db_EquiposeInfraestructura_V1";
const db_production = "db_ControldeProduccion_V4";
const db_users = "db_UsuariosySesiones";

import Facilities from "../models/facilities.js";
const facilities = new Facilities();
import Users from "../models/users.js";
const users = new Users();

class Production {
    
    constructor() {

    };

    async list_counters_by_user_id(id) {
        let list_counters = [];
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
                    let counters_by_area = JSON.parse(JSON.stringify(await pool.query(`SELECT * FROM ${db_production}.listaContadores WHERE area = '${area_in_location.code}';`)));
                    for (let k = 0; k < area_in_location.locations.length; k++) {
                        let location = area_in_location.locations[k];
                        let location_data = {};
                        location_data.code = location.code;
                        location_data.name = location.name;
                        location_data.counters = [];
                        for (let c = 0; c < counters_by_area.length; c++) {
                            const counter_in_area = counters_by_area[c];
                            //let counter_code = facilities.get_equipment_code(counter_in_area.area, counter_in_area.id);
                            let counter_code = counter_in_area.codigo;
                            if( counter_in_area.ubicacion ===  location.code){
                                if(location_data.counters.map((counter) => counter.code).indexOf(counter_code) === -1){
                                    let data_counter = {};
                                    data_counter.id = counter_in_area.id;
                                    data_counter.code = counter_in_area.codigo;
                                    data_counter.name = counter_in_area.equipo;
                                    location_data.counters.push(data_counter);
                                }
                            }
                        };                                                
                        if(location_data.counters.length>0){                            
                            area_data.locations.push(location_data);
                        }
                    }
                    if(area_data.locations.length>0){
                        plant_data.areas.push(area_data);
                    }
                }
                if(plant_data.areas.length>0){
                    list_counters.push(plant_data);
                }
            }
            //list_counters = tree_locations;
            console.log(JSON.stringify(list_counters));
        }
        return list_counters;
    };
}

export default Production;