import pool from "../database.js";

const db_name = "db_EquiposeInfraestructura_V1";
const zeroPad = (num, places) => String(num).padStart(places, '0');

class Facilities {
    plants = [];
    areas = [];
    locations = [];

    ambient = [];
    nivel = [];

    infraestructures = [];

    type_class = [];
    type_module = [];
    type_calibration = [];
    type_equipmet = [];

    equipments = [];

    constructor() {
        this.load_infraestructures();
        this.load_equipments();
    }

    get_equipment_code(area, id){
        let code = '';
        code = code.concat(zeroPad(id / 1000,3));
        if(id % 1000 !== 0)
            code = code.concat(' ', id % 1000);
        code = ''.concat(area, '-', code);
        return code;
    }

    async load_equipments() {
        this.type_class = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.ClasificacionPrimaria;`)));
        this.type_module = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.ClasificacionSecundaria;`)));
        this.type_calibration = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.TipodeCalibracion;`)));
        this.type_equipmet = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.TipodeEquipo;`)));

        this.equipments = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.Equipos;`)));
        this.equipments.forEach(equipment => {
            if(equipment.area){
                let code = '';
                code=code.concat(zeroPad(equipment.id / 1000,3));
                if(equipment.id % 1000 !== 0)
                    code=code.concat(' ', equipment.id % 1000);
                equipment.codigo = ''.concat(equipment.area,'-',code);
            } 
        });
    }

    async load_infraestructures() {
        this.plants = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.plantas;`)));
        this.areas = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.areas;`)));
        this.locations = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.ubicaciones;`)));

        this.ambient = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.ambientes;`)));
        this.nivel = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.niveles;`)));

        this.infraestructures = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.infraestructuras;`)));

        // Calculamos los totales.
        this.plants.forEach(planta => {
            planta.areas = 0;
            this.areas.forEach(area => {
                if (area.planta == planta.codigo) planta.areas++;
                area.ubicaciones = 0;
                this.infraestructures.forEach(infraestructura => {
                    if (infraestructura.area == area.codigo) area.ubicaciones++;
                });
            });
        });
    }

    // EQUIPOS
    list_equipments_by_plant(plant) {
        let filter_equipment = this.equipments.filter(x => x.planta == plant);
        return filter_equipment;
    }
    list_equipments_by_area(area) {
        let filter_equipment = this.equipments.filter(x => x.area == area);
        return filter_equipment;
    }
    list_equipments_by_zone(zone) {
        let filter_equipment = this.equipments.filter(x => x.ubicacion == zone);
        return filter_equipment;
    }

    // EQUIPMENT CRUD
    async get_equipment_data(equipment){
        let result_equipment = {};
        let result = JSON.parse(JSON.stringify(await pool.query(`call ${db_name}.getDataEquipo(?);`, [equipment])));
        
        if(result[0][0]){
            result_equipment = result[0][0];
        }
        return result_equipment;
    }

    async deleteEquipment(id){
        if(Number.isInteger(Number(id))){
            let result = await pool.query(`call ${db_name}.eliminarEquipo(?);`, [id]);
            return (result.affectedRows >= 0);
        } 
        return false;
    };


    get_zone_data(code_zone){
        let data = {};
        data.area = code_zone.match(/^(\D\D\D)/g)[0].trim();
        data.codigo = Number(code_zone.match(/(\d\d)/g)[0].trim());
        return this.getLocation(data.codigo, data.area);
    }

    get_area_data(code_area){
        return this.areas.find(x => x.codigo === code_area);
    }

    get_plant_data(code_planta){
        return this.plants.find(x => x.codigo === code_planta);
    }

    get_area_by_zone(code_zone){        
        let code_area = this.equipments.find(x=>x.ubicacion === code_zone).area;        
        return this.areas.find(x => x.codigo === code_area);
    }
    
    get_plant_by_area(code_area){
        let code_plant = this.areas.find(x=>x.codigo === code_area).planta;
        return this.plants.find(x=> x.codigo = code_plant);
    }

    // INFRAESTRUCTURAS

    list_plants() {
        return this.plants;
    }

    list_areas(code_plant) {
        let filter_area = this.areas.filter(x => x.planta == code_plant);
        return filter_area;
    }

    list_locations(code_area) {
        let locations = [];
        this.infraestructures.forEach(infraestructure => {
            let location = {};
            let code = `${infraestructure.area} ${('' + infraestructure.codigo).padStart(2, '0')} ${infraestructure.ambiente}${infraestructure.pisonivel}`;
            let area = this.areas.find(area => area.codigo == infraestructure.area);

            location.planta = this.plants.find(planta => planta.codigo == area.planta).detalle;
            location.area = area.detalle;
            location.codigo = code;
            location.nombre = infraestructure.detalle;
            location.ambiente = this.ambient.find(ambiente => ambiente.codigo === infraestructure.ambiente).detalle;
            location.pisonivel = this.nivel.find(pisonivel => pisonivel.codigo === infraestructure.pisonivel).detalle;

            if (area.codigo === code_area || code_area === undefined)
                locations.push(location);
        });
        return locations;
    }

    getDataArea(code_area) {
        return this.areas.find(x => x.codigo === code_area);
    }

    getDataPlant(code_area) {
        let area = getDataArea(code_area);
        let code_plant = this.getCodePlant(area.planta);
        return this.plants.find(x => x.codigo === code_plant);
    }

    getTotalLocations() {
        return this.infraestructures.length;
    }

    getTotalEquipments() {
        return this.equipments.length;
    }

    getLocation(code, area) {
        let filter_location = this.infraestructures.find(x => x.codigo === code && x.area === area);
        return filter_location;
    }

    async getTreeLocations() {
        let zonas = {};
        const infraestructuras = {};

        infraestructuras.plantas = this.plants;
        infraestructuras.areas = this.areas;
        infraestructuras.ubicaciones = this.list_locations();
        //console.log(infraestructuras.ubicaciones);
        zonas.plantas = [];
        infraestructuras.plantas.forEach(function (planta) {
            let { codigo, detalle} = planta;
            let total = planta.areas;
            let areas = [];
            infraestructuras.areas.forEach(function (area) {
                if (area.planta === planta.codigo) {
                    let new_area = {};
                    new_area.codigo = area.codigo;
                    new_area.detalle = area.detalle;
                    new_area.total = area.ubicaciones;
                    let ubicaciones = [];
                    
                    infraestructuras.ubicaciones.forEach(function (ubicacion) {
                        let code_area = ubicacion.codigo.match(/^(\D\D\D)/g)[0].trim();
                        if (code_area === area.codigo) {
                            let new_ubicacion = {};
                            new_ubicacion.codigo = ubicacion.codigo;
                            new_ubicacion.detalle = ubicacion.nombre;
                            //new_ubicacion.total = this.equipments.filter(x => x.ubicacion == ubicacion.codigo).length;
                            ubicaciones.push(new_ubicacion);
                        }
                    });
                    new_area.ubicaciones = ubicaciones;
                    areas.push(new_area);
                }
            });
            zonas.plantas.push({ codigo, detalle, total, areas });
        });
        return zonas;
    }

    // CREATE-UPDATE-DELETE
    async createLocation(infraestructura) {
        let areas = await pool.query(`SELECT  * FROM  ${db_name}.Area;`);
        let ambientes = await pool.query(`SELECT  * FROM ${db_name}.tipoAmbiente;`);
        let pisoniveles = await pool.query(`SELECT  * FROM ${db_name}.tipoPisoNivel;`);

        let index_area = areas.findIndex(x => x.codigo === infraestructura.area);
        let index_ambiente = ambientes.findIndex(x => x.codigo === infraestructura.ambiente);
        let index_pisonivel = pisoniveles.findIndex(x => x.codigo === infraestructura.pisonivel);

        let data = {};
        if (infraestructura.codigo > 0 && infraestructura.codigo < 100 && index_area != -1 && index_ambiente != -1 && index_pisonivel != -1) {

            data.codigo = Number(infraestructura.codigo);
            data.detalle = infraestructura.detalle;
            data.area = areas[index_area].id;
            data.ambiente = ambientes[index_ambiente].id;
            data.pisonivel = pisoniveles[index_pisonivel].id;
            let result = await pool.query(`call ${db_name}.agregarInfraestructura(?,?,?,?,?);`, [data.codigo, data.area, data.detalle, data.ambiente, data.pisonivel]);
            if (result.affectedRows > 0) {
                this.load_infraestructures();
                return true;
            }
            else return false;
        }
        else return false;
    }

    async updateLocation(infraestructura) {
        let areas = await pool.query(`SELECT  * FROM ${db_name}.Area;`);
        let ambientes = await pool.query(`SELECT  * FROM ${db_name}.tipoAmbiente;`);
        let pisoniveles = await pool.query(`SELECT  * FROM ${db_name}.tipoPisoNivel;`);

        let data = {};

        let index_area = areas.findIndex(x => x.codigo === infraestructura.area);
        let index_ambiente = ambientes.findIndex(x => x.codigo === infraestructura.ambiente);
        let index_pisonivel = pisoniveles.findIndex(x => x.codigo === infraestructura.pisonivel);

        if (index_area != -1 && index_ambiente != -1 && index_pisonivel != -1) {
            data.codigo = Number(infraestructura.codigo);
            data.detalle = infraestructura.detalle;
            data.area = areas[index_area].id;
            data.ambiente = ambientes[index_ambiente].id;
            data.pisonivel = pisoniveles[index_pisonivel].id;
            //console.log(data);

            let result = await pool.query(`call ${db_name}.actualizarInfraestructura(?,?,?,?,?);`, [data.codigo, data.area, data.detalle, data.ambiente, data.pisonivel]);
            //console.log(result);
            if (result.affectedRows > 0) {
                this.load_infraestructures();
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }

    async deleteLocation(codigo, area) {
        let areas = await pool.query(`SELECT  * FROM ${db_name}.Area;`);

        let index_area = areas.findIndex(x => x.codigo === area);

        let data = {};

        if (codigo > 0 && codigo < 100 && index_area != -1) {
            data.codigo = Number(codigo);
            data.area = areas[index_area].id;

            let result = await pool.query(`call ${db_name}.eliminarInfraestructura(?,?);`, [data.codigo, data.area]);
            if (result.affectedRows > 0) {
                this.load_infraestructures();
                return true;
            }
            else
                return false;
        }
        else return false;
    }



    // VISTAS
    generate_breadcrum_zone(code_zone){
        let url_location='';        
        let data_zone = this.get_zone_data(code_zone);
        let data_area = this.get_area_by_zone(code_zone);
        let data_plant = this.get_plant_by_area(data_area.codigo);
        if(data_zone && data_area && data_plant){
            url_location =
            `<li class="breadcrumb-item">
                <a href="/administrar/instalaciones/equipos" class="text-primary" >Equipos</a>
            </li>
            <li class="breadcrumb-item">
                <a href="/administrar/instalaciones/equipos?plant=${data_plant.codigo}" class="text-primary" data-toggle="tooltip" data-placement="bottom" title="${data_plant.detalle}">${data_plant.codigo}</a>
            </li>
            <li class="breadcrumb-item">
                <a href="/administrar/instalaciones/equipos?area=${data_area.codigo}" class="text-primary" data-toggle="tooltip" data-placement="bottom" title="${data_area.detalle}">${data_area.codigo}</a>
            </li>
            <li class="breadcrumb-item">
                <label class="text-primary" data-toggle="tooltip" data-placement="bottom" title="${code_zone}">${data_zone.detalle}</label>
            </li>`;
        }
        return url_location;
    }

};

export default Facilities;