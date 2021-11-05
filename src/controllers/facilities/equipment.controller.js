import pool from "../../database.js";

const links = {
    path:"/instalaciones/equipos",
    add:"/agregar",
    edit:"/editar",
    update:"/modificar",
    delete:"/eliminar",
    save:"/guardar"
};

const equipmentCtrl = {};

equipmentCtrl.list = async function(req, res) {   
    const instalaciones = {}
    const result = await pool.query("select * from db_EquiposeInfraestructura.Equipos;");
    instalaciones.equipos = JSON.parse(JSON.stringify(result));    
    res.render('facilities/equipment/list.hbs',{ instalaciones, links });
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
    instalaciones.planta = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.Planta;")));
        instalaciones.area = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.Area;")));
        instalaciones.ubicacion = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.Infraestructuras;")));
        instalaciones.clase = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.ClasificacionPrimaria;")));
        instalaciones.modulo = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.ClasificacionSecundaria;")));
        instalaciones.calibracion = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.TipodeCalibracion;")));  
        instalaciones.tipo = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.TipodeEquipo;")));    
    instalaciones.equipos = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.CodificacionEquipos;")));
    //equipo.id = Math.max.apply(Math, instalaciones.equipos.map(function (o) { return o.id; })) + 1000;
    //console.log(instalaciones); 
    res.render('facilities/equipment/edit.hbs',{ instalaciones , links , card });
}; 

equipmentCtrl.edit = async function(req, res){    
    let card={
            title:"EDITAR DATOS DEL EQUIPO",
            header:"bg-info text-light text-center",
            border: "border-info"
    };
    let { id } = req.query; 
    let result = await pool.query("call db_EquiposeInfraestructura.getDataEquipo(?);",[id]);
    let instalaciones = {};
    //console.log(id);   
    if(result[0].length>0){
        instalaciones.equipo = JSON.parse(JSON.stringify(result[0][0]));
        instalaciones.equipo.actualizar = true; 
        instalaciones.planta = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.Planta;")));
        instalaciones.area = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.Area;")));
        instalaciones.ubicacion = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.Infraestructuras;")));
        instalaciones.clase = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.ClasificacionPrimaria;")));
        instalaciones.modulo = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.ClasificacionSecundaria;")));
        instalaciones.calibracion = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.TipodeCalibracion;")));  
        instalaciones.tipo = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.TipodeEquipo;")));              
        instalaciones.equipos = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura.CodificacionEquipos;")));
    }
    res.render('facilities/equipment/edit.hbs', { instalaciones , links , card});
};

equipmentCtrl.save = async function(req, res){
    var equipo = JSON.parse(JSON.stringify(req.body.equipo));
    console.log(equipo);
    if(equipo.id>=1000){       
        let result = await pool.query("call db_EquiposeInfraestructura.agregarEquipo(?);", [equipo.id]);
        if(result.affectedRows>0){            
            let result =  await pool.query("call db_EquiposeInfraestructura.actualizarEquipo(?,?,?,?,?,?,?);", [equipo.id, equipo.gmp, equipo.objeto, equipo.elemento, equipo.caracteristicas, equipo.calibracion, equipo.tipo]);            
            if(equipo.ubicacion !=0){
                let result = await pool.query("call db_EquiposeInfraestructura.instalarEquipo(?,?);", [equipo.id, equipo.ubicacion]);
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
    let result =  await pool.query("call db_EquiposeInfraestructura.actualizarEquipo(?,?,?,?,?,?,?);", [equipo.id, equipo.gmp, equipo.objeto, equipo.elemento, equipo.caracteristicas, equipo.calibracion, equipo.tipo]);
    if(result.affectedRows>0)   res.send();
    else    res.sendStatus(500);
    if(equipo.ubicacion !=0){
        let result = await pool.query("call db_EquiposeInfraestructura.instalarEquipo(?,?);", [equipo.id, equipo.ubicacion]);
        if(result.affectedRows>0)   res.send();
        else    res.sendStatus(500);
    }    
};

equipmentCtrl.delete = async function(req, res){
    var { id }  = JSON.parse(JSON.stringify(req.body));
    console.log(id);      
    let result =  await pool.query("call db_EquiposeInfraestructura.eliminarEquipo(?);", [id]);
    if(result.affectedRows>0)   res.send();
    else    res.sendStatus(500).send('Ocurrio un error!');
};

export default equipmentCtrl;