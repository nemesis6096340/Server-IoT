import pool from "../../database.js";

import Facilities from "../../models/facilities.js";
import {updateURLParameter} from "../../lib/helpers.js";

const facilities = new Facilities();

const links = {
    path: "/administrar/instalaciones/infraestructuras",
    add: "/agregar",
    edit: "/editar",
    update: "/modificar",
    delete: "/eliminar",
    save: "/guardar",
    plant: "/plantas",
    areas: "/areas"
};

const navigation = {
    path: "instalaciones"

};

const navigate = { facilities: true };

const infrastructureCtrl = {};

infrastructureCtrl.plant = async function (req, res) {
    let plant = facilities.list_plants();
    res.render('admin/facilities/infrastructure/plants.hbs', { plant, navigate });
}

infrastructureCtrl.area = async function (req, res) {
    let { plant } = req.query;
    let areas = facilities.list_areas(plant);

    let breadcrumb = `
    <ul class="breadcrumb">
        <span><i class="fa fa-tasks mx-2"></i></span>
        <li class="breadcrumb-item">
            <a href="/administrar" class="text-primary">Administrar</a>
        </li>
        <li class="breadcrumb-item">
            <a href="/administrar/instalaciones" class="text-primary">Instalaciones</a>
        </li>
        <li class="breadcrumb-item">
            <a href="/administrar/instalaciones/infraestructuras" class="text-primary">Infraestructuras</a>
        </li>
        <li class="breadcrumb-item">
            <a href="/administrar/instalaciones/infraestructuras/plantas" class="text-primary">Plantas</a>
        </li>
        <li class="breadcrumb-item">
            ${facilities.plants.find(x => x.codigo === plant).detalle}            
        </li>
    </ul>`

    res.render('admin/facilities/infrastructure/areas.hbs', { areas, navigate, breadcrumb });
}

infrastructureCtrl.location = async function (req, res) {
    let { area } = req.query;

    const instalaciones = {};
    let breadcrumb = `
    <ul class="breadcrumb">
        <span><i class="fa fa-tasks mx-2"></i></span>
        <li class="breadcrumb-item">
            <a href="/administrar" class="text-primary">Administrar</a>
        </li>
        <li class="breadcrumb-item">
            <a href="/administrar/instalaciones" class="text-primary">Instalaciones</a>
        </li>
        <li class="breadcrumb-item">
            <a href="/administrar/instalaciones/infraestructuras" class="text-primary">Infraestructuras</a>
        </li>
        <li class="breadcrumb-item">
            <a href="/administrar/instalaciones/infraestructuras/plantas" class="text-primary">Plantas</a>
        </li>
        <li class="breadcrumb-item">
            <a href="/administrar/instalaciones/infraestructuras/plantas/areas?plant=${facilities.areas.find(x => x.codigo === area).planta}" class="text-primary">
                ${facilities.plants.find(x => x.codigo === facilities.areas.find(x => x.codigo === area).planta).detalle}
            </a>
        </li>
        <li class="breadcrumb-item">
            ${facilities.areas.find(x => x.codigo === area).detalle}
        </li>
    </ul>`



    instalaciones.infraestructuras = facilities.list_locations(area);
    instalaciones.area = area;

    links.redirect = req.originalUrl;

    let file_name = ''.concat(instalaciones.infraestructuras[0].planta, " - ", instalaciones.infraestructuras[0].area);
    let file_export_options = JSON.stringify({ 'fileName': file_name });
    res.render('admin/facilities/infrastructure/list.hbs', { instalaciones, links, file_export_options, navigate, breadcrumb, area });
}

infrastructureCtrl.list = async function (req, res) {
    const instalaciones = {}
    let breadcrumb = `
    <ul class="breadcrumb">
        <span><i class="fa fa-tasks mx-2"></i></span>
        <li class="breadcrumb-item">
            <a href="/administrar" class="text-primary">Administrar</a>
        </li>
        <li class="breadcrumb-item">
            <a href="/administrar/instalaciones" class="text-primary">Instalaciones</a>
        </li>
        <li class="breadcrumb-item"  class="text-primary">
            Infraestructuras
        </li>
    </ul>`
    instalaciones.infraestructuras = facilities.list_locations();
    let {search} = req.query;    
    links.redirect = req.originalUrl;
    res.render('admin/facilities/infrastructure/list.hbs', { instalaciones, links, navigate, breadcrumb, search });
};

infrastructureCtrl.add = async function (req, res) {
    let card = {
        title: "NUEVA INFRAESTRUCTURA",
        header: "bg-success text-light text-center",
        border: "border-success"
    };

    let { area } = req.query;
    //console.log(area);
    const instalaciones = {};

    instalaciones.planta = JSON.parse(JSON.stringify(facilities.plants));
    instalaciones.area = JSON.parse(JSON.stringify(facilities.areas));

    instalaciones.ambiente = JSON.parse(JSON.stringify(facilities.ambient));
    instalaciones.pisonivel = JSON.parse(JSON.stringify(facilities.nivel));
    instalaciones.infraestructuras = JSON.parse(JSON.stringify(facilities.list_locations(area)));

    let codigo = facilities.getDataArea(area).ubicaciones;


    instalaciones.infraestructura = {
        codigo: codigo + 1,
        detalle: "",
        area: area,
        ambiente: "",
        pisonivel: "",
        actualizar: false
    };

    console.log(instalaciones.infraestructura);

    res.render('admin/facilities/infrastructure/edit.hbs', { instalaciones, links, card, navigate });
};



infrastructureCtrl.edit = async function (req, res) {
    //console.log(req.headers.referer);
    let card = {
        title: "EDITAR INFRAESTRUCTURA",
        header: "bg-info text-light text-center",
        border: "border-info",
        return: ""
    };
    let { edit, search } = req.query;
    console.log(edit);
    console.log(search);
    if(search){
        //if(!links.redirect.search('search'))
        links.redirect = updateURLParameter(links.redirect,'search',search);
            //links.redirect +=((links.redirect.split('?')[1] ? '&':'?') +'search='+search);
    }
    console.log(links.redirect);
    if (edit) {
        let data = {};
        data.area = edit.match(/^(\D\D\D)/g)[0].trim();

        data.codigo = Number(edit.match(/(\d\d)/g)[0].trim());
        let location = facilities.getLocation(data.codigo, data.area);
        
        const instalaciones = {};
        if (location) {            
            instalaciones.infraestructura = JSON.parse(JSON.stringify(location));
            instalaciones.infraestructura.actualizar = true;
            instalaciones.planta = JSON.parse(JSON.stringify(facilities.plants));
            instalaciones.area = JSON.parse(JSON.stringify(facilities.areas));
            instalaciones.ambiente = JSON.parse(JSON.stringify(facilities.ambient));
            instalaciones.pisonivel = JSON.parse(JSON.stringify(facilities.nivel));
            instalaciones.infraestructuras = JSON.parse(JSON.stringify(facilities.list_locations(data.area)));            
            res.render('admin/facilities/infrastructure/edit.hbs', { instalaciones, links, card, navigate });
        }
    }
};

infrastructureCtrl.save = async function (req, res) {
    var infraestructura = JSON.parse(JSON.stringify(req.body.infraestructura));

    console.log(infraestructura);

    let result = await facilities.createLocation(infraestructura);
    if (result)
        res.sendStatus(200);
    else
        res.sendStatus(500);
};

infrastructureCtrl.update = async function (req, res) {
    let infraestructura = JSON.parse(JSON.stringify(req.body.infraestructura));
    console.log(infraestructura);
    let result = await facilities.updateLocation(infraestructura);
    if (result)
        res.sendStatus(200);
    else
        res.sendStatus(500);
};

infrastructureCtrl.delete = async function (req, res) {
    let { code } = JSON.parse(JSON.stringify(req.body));
    let data = {};

    data.area = code.match(/^(\D\D\D)/g)[0];
    data.codigo = Number(code.match(/(\d\d)/g)[0]);
    console.log(data);
    let result = await facilities.deleteLocation(data.codigo, data.area);

    if (result) res.send();
    else res.sendStatus(500).send('Ocurrio un error!');
};

export default infrastructureCtrl;