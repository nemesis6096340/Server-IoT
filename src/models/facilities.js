import pool from "../database.js";

const db_name = "db_EquiposeInfraestructura_V1";

class Facilities {
    plants = [];
    areas = [];
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

    async load_equipments() {
        this.type_class = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.ClasificacionPrimaria;`)));
        this.type_module = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.ClasificacionSecundaria;`)));
        this.type_calibration = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.TipodeCalibracion;`)));
        this.type_equipmet = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.TipodeEquipo;`)));

        this.equipments = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.Equipos;`)));
    }

    async load_infraestructures() {
        this.plants = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.plantas;`)));
        this.areas = JSON.parse(JSON.stringify(await pool.query(`select * from ${db_name}.areas;`)));
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
        /*
        infraestructuras.plantas = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura_v1.plantas;")));
        infraestructuras.areas = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura_v1.areas;")));
        */
        //infraestructuras.ubicaciones = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura_v1.ubicaciones;")));


        infraestructuras.plantas = this.plants;
        infraestructuras.areas = this.areas;
        infraestructuras.ubicaciones = this.list_locations();
        //console.log(infraestructuras.ubicaciones);
        zonas.plantas = [];
        infraestructuras.plantas.forEach(function (planta) {
            let { codigo, detalle } = planta;
            let areas = [];
            infraestructuras.areas.forEach(function (area) {
                if (area.planta === planta.codigo) {
                    let new_area = {};
                    new_area.codigo = area.codigo;
                    new_area.detalle = area.detalle;
                    let ubicaciones = [];
                    infraestructuras.ubicaciones.forEach(function (ubicacion) {
                        let code_area = ubicacion.codigo.match(/^(\D\D\D)/g)[0].trim();
                        if (code_area === area.codigo) {
                            let new_ubicacion = {};
                            new_ubicacion.codigo = ubicacion.codigo;
                            new_ubicacion.detalle = ubicacion.nombre;
                            ubicaciones.push(new_ubicacion);
                        }
                    });
                    new_area.ubicaciones = ubicaciones;
                    areas.push(new_area);
                }
            });
            zonas.plantas.push({ codigo, detalle, areas });
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
};

export default Facilities;