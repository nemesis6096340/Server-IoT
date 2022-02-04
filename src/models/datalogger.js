import pool from "../database.js";

const db_facilities = "db_EquiposeInfraestructura_V1";
const db_datalogger = "db_TermohigrometriaNET_V4";
const db_users = "db_UsuariosySesiones";

import Facilities from "../models/facilities.js";
const facilities = new Facilities();

class Datalogger {
    
    constructor() {

    };

    async list_dataloggers_by_user_id(id) {
        let list_dataloggers = [];
        if (Number.isInteger(Number(id))) {
            let result = JSON.parse(JSON.stringify(await pool.query(`SELECT role FROM ${db_users}.Usuarios WHERE id=${id};`)));
            if (result[0]) {
                let role = JSON.parse(result[0].role);
                let locations_by_user = [];                
                for (let index = 0; index < role.locations.length; index++) {
                    let filter_location = role.locations[index].replace(/\?/g, '%');
                    let result_locations = JSON.parse(JSON.stringify(await pool.query(`SELECT * FROM ${db_facilities}.ubicaciones WHERE codigo like '${filter_location}';`)));                    
                    result_locations.forEach(location => {
                        if(locations_by_user.indexOf(location) === -1) {
                            locations_by_user.push(location);
                        }
                    });                    
                }
                
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
                                        "sensors": [
                                            {
                                                "code":"LE 1022",
                                                "name":"Sensor...."
                                            }
                                        ]
                                    },
                                    {
                                        "code":"LE 02 PB",
                                        "name": "Preparado",
                                        "sensors": [
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
                
                let list_datalogger = [];
                let plants = [];

                for (let i = 0; i < locations_by_user.length; i++) {
                    const location_in_user = locations_by_user[i];
                    if(plants.map((plant) => plant.code).indexOf(location_in_user.planta) === -1){
                        let data_plant = {};
                        data_plant.code = location_in_user.planta;
                        data_plant.name = facilities.get_plant_data(data_plant.code).detalle;
                        let areas = [];
                        let locations_by_plant = locations_by_user.filter(x => x.planta == data_plant.code);
                        for (let j = 0; j < locations_by_plant.length; j++) {
                            const location_in_plant = locations_by_plant[j];                             
                            if(areas.map((area) => area.code).indexOf(location_in_plant.area) === -1){
                                let data_area = {};
                                data_area.code = location_in_plant.area;
                                data_area.name = facilities.get_area_data(location_in_plant.area).detalle;
                                
                                let sensors_by_area = JSON.parse(JSON.stringify(await pool.query(`SELECT * FROM ${db_datalogger}.listaTermohigrometros WHERE area = '${data_area.code}';`)));                                
                                let locations = [];
                                let locations_by_area = locations_by_user.filter(x => x.area === data_area.code);
                                for (let k = 0; k < locations_by_area.length; k++) {
                                    const location_in_area = locations_by_area[k];
                                    if(locations.map((location) => location.code).indexOf(location_in_area.codigo) === -1){
                                        let data_location = {};
                                        data_location.code = location_in_area.codigo;
                                        data_location.name = location_in_area.detalle;
                                        
                                        let sensors = [];
                                        for (let s = 0; s < sensors_by_area.length; s++) {
                                            const sensor_in_area = sensors_by_area[s];
                                            let sensor_code = facilities.get_equipment_code(sensor_in_area.area, sensor_in_area.id);                                                
                                            if( sensor_in_area.ubicacion ===  data_location.code){
                                                if(sensors.map((sensor) => sensor.code).indexOf(sensor_code) === -1){
                                                    let data_sensor = {};
                                                    data_sensor.code = sensor_code;
                                                    data_sensor.name = sensor_in_area.objeto;
                                                    sensors.push(data_sensor);
                                                } 
                                            }
                                        };
                                        data_location.sensors = sensors;
                                        if(data_location.sensors.length>0)
                                            locations.push(data_location);
                                    }
                                };
                                data_area.locations = locations;
                                if(data_area.locations.length>0)
                                    areas.push(data_area);
                            }
                        };
                        data_plant.areas = areas;
                        if(data_plant.areas.length>0)
                            plants.push(data_plant);
                    }
                };
                console.log(JSON.stringify(plants));
                list_dataloggers = plants;
            }
        }
        return list_dataloggers;
    };
};

export default Datalogger;