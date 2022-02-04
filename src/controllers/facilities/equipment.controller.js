import pool from "../../database.js";
import Facilities from "../../models/facilities.js";
import { updateURLParameter } from "../../lib/helpers.js";

const db_name = "db_EquiposeInfraestructura_V1";
const facilities = new Facilities();

function renameProperty(obj, oldName, newName) {
    obj[newName] = obj[oldName];
    delete obj[oldName];
  }

const links = {
    path: "/administrar/instalaciones/equipos",
    add: "/agregar",
    edit: "/editar",
    update: "/modificar",
    delete: "/eliminar",
    save: "/guardar"
};

const database = "db_EquiposeInfraestructura_V1";

const navigate = { facilities: true };

const equipmentCtrl = {};

equipmentCtrl.list = async function (req, res) {
    let { search, plant, area, zone } = req.query;
    let url_location = ''
    await facilities.load_equipments();
    const zonas = await facilities.getTreeLocations();
    const instalaciones = {}
    instalaciones.equipos = [];
    //const result = await pool.query(`select * from ${database}.Equipos;`);
    
    if (zone && /^((.*?)\D\D \d\d \D\D)$/.test(zone)) {                
        instalaciones.equipos = JSON.parse(JSON.stringify(facilities.list_equipments_by_zone(zone)));
        url_location = facilities.generate_breadcrum_zone(zone);        
    }

    else if (area) {
        instalaciones.equipos = JSON.parse(JSON.stringify(facilities.list_equipments_by_area(area)));
        if (instalaciones.equipos.length != 0) {
            let data_area = facilities.get_area_data(area);
            let data_plant = facilities.get_plant_by_area(data_area.codigo);
            url_location =
            `<li class="breadcrumb-item">
                <a href="/administrar/instalaciones/equipos" class="text-primary" >Equipos</a>
            </li>
            <li class="breadcrumb-item">
                <a href="/administrar/instalaciones/equipos?plant=${data_plant.codigo}" class="text-primary" data-toggle="tooltip" data-placement="bottom" title="${data_plant.detalle}">${data_plant.codigo}</a>
            </li>
            <li class="breadcrumb-item">
                <label class="text-primary" data-toggle="tooltip" data-placement="bottom" title="${area}">${data_area.detalle}</label>
            </li>`;
        }
    }
    else if (plant){
        instalaciones.equipos = JSON.parse(JSON.stringify(facilities.list_equipments_by_plant(plant)));
        if (instalaciones.equipos.length != 0) {
            let data_plant = facilities.get_plant_data(plant);
            url_location =
            `<li class="breadcrumb-item">
                <a href="/administrar/instalaciones/equipos" class="text-primary" >Equipos</a>
            </li>
            <li class="breadcrumb-item">
                <label class="text-primary" data-toggle="tooltip" data-placement="bottom" title="${plant}">${data_plant.detalle}</label>
            </li>`;
        }
    }

    if (instalaciones.equipos.length == 0) {
        instalaciones.equipos = JSON.parse(JSON.stringify(facilities.equipments));
        url_location = `<li class="breadcrumb-item">
            <a href="#" class="text-primary" >Equipos</a>
        </li>`
    }

    let breadcrumb = `
    <ul class="breadcrumb">
        <span><i class="fa fa-tasks mx-2"></i></span>
        <li class="breadcrumb-item">
            <a href="/administrar" class="text-primary">Administrar</a>
        </li>
        <li class="breadcrumb-item">
            <a href="/administrar/instalaciones" class="text-primary">Instalaciones</a>
        </li>        
        ${url_location}
        <li class="breadcrumb-item ml-2">
            <a href=# class="text-primary" data-toggle="modal" data-target="#modal-find-zone"><span><i class="fa fa-map mx-2"></i>Listar por ubicacion</span></a>
        </li>
    </ul>`

    links.redirect = req.originalUrl;
    console.log(links);

    let file_name = 'Lista_equipos';
    if(plant)
        file_name = file_name.concat('_', plant);
    if(area){
        let data_area = facilities.get_area_data(area);
        let data_plant = facilities.get_plant_by_area(data_area.codigo);
        file_name = file_name.concat('_',data_plant.codigo,'_',area);
    }
    if(zone)
        file_name = file_name.concat('_', zone);
    
    let file_export_options = JSON.stringify({ 'fileName': file_name });
    res.render('admin/facilities/equipment/list.hbs', { instalaciones, links, navigate, breadcrumb, search, zonas ,file_export_options});
};

equipmentCtrl.add = async function (req, res) {
    let card = {
        title: "AGREGAR NUEVO EQUIPO",
        header: "bg-success text-light text-center",
        border: "border-success"
    };
    let equipo = {
        id: 0,
        objeto: "",
        elemento: "",
        caracteristicas: "",
        gmp: false,
        calibracion: 0,
        ubicacion: 0,
        tipo: 0,
        actualizar: false
    };

    const instalaciones = {}
    instalaciones.equipo = equipo;
    instalaciones.planta = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.Plantas;`)));
    instalaciones.area = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.Areas;`)));
    instalaciones.ubicacion = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.Infraestructuras;`)));
    instalaciones.clase = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.ClasificacionPrimaria;`)));
    instalaciones.modulo = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.ClasificacionSecundaria;`)));
    instalaciones.calibracion = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.TipodeCalibracion;`)));
    instalaciones.tipo = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.TipodeEquipo;`)));
    instalaciones.equipos = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.CodificacionEquipos;`)));
    //equipo.id = Math.max.apply(Math, instalaciones.equipos.map(function (o) { return o.id; })) + 1000;
    //console.log(instalaciones); 
    res.render('admin/facilities/equipment/edit.hbs', { instalaciones, links, card, navigate });
};

equipmentCtrl.edit = async function (req, res) {
    let card = {
        title: "EDITAR DATOS DEL EQUIPO",
        header: "bg-info text-light text-center",
        border: "border-info"
    };
    let { id, search } = req.query;
    if (search) {
        //if(!links.redirect.search('search'))
        links.redirect = updateURLParameter(links.redirect, 'search', search);
        //links.redirect +=((links.redirect.split('?')[1] ? '&':'?') +'search='+search);
    }
    let result = await facilities.get_equipment_data(id);    
    let instalaciones = {};
    if (result) {        
        instalaciones.equipo = result;
        instalaciones.equipo.actualizar = true;
        
        instalaciones.planta = facilities.plants;
        instalaciones.area = facilities.areas;
        instalaciones.ubicacion = facilities.locations;
        instalaciones.clase = facilities.type_class;
        instalaciones.modulo = facilities.type_module;
        instalaciones.calibracion = facilities.type_calibration;
        instalaciones.tipo = facilities.type_equipmet;

        instalaciones.equipos = facilities.equipments;
    }
    res.render('admin/facilities/equipment/edit.hbs', { instalaciones, links, card, navigate });
};

equipmentCtrl.save = async function (req, res) {
    var equipo = JSON.parse(JSON.stringify(req.body.equipo));
    //console.log(equipo);
    if (equipo.id >= 1000) {
        let result = await pool.query(`call ${database}.agregarEquipo(?);`, [equipo.id]);
        if (result.affectedRows > 0) {
            let result = await pool.query(`call ${database}.actualizarEquipo(?,?,?,?,?,?,?);`, [equipo.id, equipo.gmp, equipo.objeto, equipo.elemento, equipo.caracteristicas, equipo.calibracion, equipo.tipo]);
            if (equipo.ubicacion != 0) {
                let result = await pool.query(`call ${database}.instalarEquipo(?,?);`, [equipo.id, equipo.ubicacion]);
                if (result.affectedRows > 0) res.send();
                else res.sendStatus(500);
            }
            else res.sendStatus(500);
        }
        else res.sendStatus(500);
    }
    else res.sendStatus(500);
};

equipmentCtrl.update = async function (req, res) {
    var equipo = JSON.parse(JSON.stringify(req.body.equipo));
    let result = await pool.query(`call ${database}.actualizarEquipo(?,?,?,?,?,?,?);`, [equipo.id, equipo.gmp, equipo.objeto, equipo.elemento, equipo.caracteristicas, equipo.calibracion, equipo.tipo]);    
    if (equipo.ubicacion != "") {
        let data = {};
        data.area = equipo.ubicacion.match(/^(\D\D\D)/g)[0].trim();
        data.codigo = Number(equipo.ubicacion.match(/(\d\d)/g)[0].trim());
        let result = await pool.query(`call ${database}.instalarEquipo(?,?,?);`, [equipo.id, data.area, data.codigo]);
        if (result.affectedRows > 0) res.send();
        else res.sendStatus(500);
    }
    else{
        if (result.affectedRows > 0) res.send();
        else res.sendStatus(500);
    }
};

equipmentCtrl.delete = async function (req, res) {
    var { id } = JSON.parse(JSON.stringify(req.body));
    let result = facilities.deleteEquipment(id);
    if(result)  res.send();
    else    res.sendStatus(500).send('Ocurrio un error!');
};

export default equipmentCtrl;