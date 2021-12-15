import pool from "../../database.js";
import Facilities from "../../models/facilities.js";

const db_name ="db_EquiposeInfraestructura_V1";

const links = {
    path:"/administrar/instalaciones/equipos",
    add:"/agregar",
    edit:"/editar",
    update:"/modificar",
    delete:"/eliminar",
    save:"/guardar"
};

const database ="db_EquiposeInfraestructura_V1";

const navigate = {facilities:true};

const equipmentCtrl = {};

equipmentCtrl.list = async function(req, res) {
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
            Equipos
        </li>
    </ul>`
    
    const instalaciones = {}
    const result = await pool.query(`select * from ${database}.Equipos;`);
    instalaciones.equipos = JSON.parse(JSON.stringify(result));
    
    links.redirect = req.originalUrl;
    console.log(links);
    res.render('admin/facilities/equipment/list.hbs',{ instalaciones, links , navigate, breadcrumb});
};

equipmentCtrl.add = async function(req, res) {
    let card={
        title:"AGREGAR NUEVO EQUIPO",
        header:"bg-success text-light text-center",
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
    res.render('admin/facilities/equipment/edit.hbs',{ instalaciones , links , card , navigate});
}; 

equipmentCtrl.edit = async function(req, res){    
    let card={
            title:"EDITAR DATOS DEL EQUIPO",
            header:"bg-info text-light text-center",
            border: "border-info"
    };
    let { id } = req.query; 
    let result = await pool.query(`call ${database}.getDataEquipo(?);`,[id]);
    let instalaciones = {};
    //console.log(id);   
    if(result[0].length>0){
        instalaciones.equipo = JSON.parse(JSON.stringify(result[0][0]));
        instalaciones.equipo.actualizar = true; 
        instalaciones.planta = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.Plantas;`)));
        instalaciones.area = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.Areas;`)));
        instalaciones.ubicacion = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.Infraestructuras;`)));
        instalaciones.clase = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.ClasificacionPrimaria;`)));
        instalaciones.modulo = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.ClasificacionSecundaria;`)));
        instalaciones.calibracion = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.TipodeCalibracion;`)));  
        instalaciones.tipo = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.TipodeEquipo;`)));              
        instalaciones.equipos = JSON.parse(JSON.stringify(await pool.query(`select * from ${database}.CodificacionEquipos;`)));
    }
    res.render('admin/facilities/equipment/edit.hbs', { instalaciones , links , card, navigate});
};

equipmentCtrl.save = async function(req, res){
    var equipo = JSON.parse(JSON.stringify(req.body.equipo));
    //console.log(equipo);
    if(equipo.id>=1000){       
        let result = await pool.query(`call ${database}.agregarEquipo(?);`, [equipo.id]);
        if(result.affectedRows>0){            
            let result =  await pool.query(`call ${database}.actualizarEquipo(?,?,?,?,?,?,?);`, [equipo.id, equipo.gmp, equipo.objeto, equipo.elemento, equipo.caracteristicas, equipo.calibracion, equipo.tipo]);            
            if(equipo.ubicacion !=0){
                let result = await pool.query(`call ${database}.instalarEquipo(?,?);`, [equipo.id, equipo.ubicacion]);
                if(result.affectedRows>0)   res.send();
                else    res.sendStatus(500);
            }
            else    res.sendStatus(500);
        }
        else    res.sendStatus(500);
    }
    else    res.sendStatus(500);
};

equipmentCtrl.update = async function(req, res){
    var equipo = JSON.parse(JSON.stringify(req.body.equipo));
    //console.log(equipo);
    let result =  await pool.query(`call ${database}.actualizarEquipo(?,?,?,?,?,?,?);`, [equipo.id, equipo.gmp, equipo.objeto, equipo.elemento, equipo.caracteristicas, equipo.calibracion, equipo.tipo]);
    if(result.affectedRows>0)   res.send();
    else    res.sendStatus(500);
    if(equipo.ubicacion !=0){
        let result = await pool.query(`call ${database}.instalarEquipo(?,?);`, [equipo.id, equipo.ubicacion]);
        if(result.affectedRows>0)   res.send();
        else    res.sendStatus(500);
    }    
};

equipmentCtrl.delete = async function(req, res){
    var { id }  = JSON.parse(JSON.stringify(req.body));
    console.log(id);      
    let result =  await pool.query(`call ${database}.eliminarEquipo(?);`, [id]);
    if(result.affectedRows>0)   res.send();
    else    res.sendStatus(500).send('Ocurrio un error!');
};

export default equipmentCtrl;