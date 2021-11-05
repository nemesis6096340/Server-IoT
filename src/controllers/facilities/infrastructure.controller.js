import pool from "../../database.js";

const db_name ="db_EquiposeInfraestructura_V1";

const links = {
    path: "/instalaciones/infraestructuras",
    add: "/agregar",
    edit: "/editar",
    update: "/modificar",
    delete: "/eliminar",
    save: "/guardar",
    plant:"/plantas",
    areas:"/areas"    
};
const infrastructureCtrl = {};

infrastructureCtrl.plant = async function (req, res) {
    let plant = JSON.parse(JSON.stringify(await pool.query("call mostrarPlantas();")));
    res.render('facilities/infrastructure/plants.hbs', { plant: plant[0] });
}

infrastructureCtrl.area = async function (req, res) {
    let { plant } = req.query;
    const instalaciones = {}
    let areas = JSON.parse(JSON.stringify(await pool.query("call mostrarAreas(?);", [plant])));    
    res.render('facilities/infrastructure/areas.hbs', { areas: areas[0] });
}

infrastructureCtrl.location = async function (req, res) {
    let { area } = req.query;
    const instalaciones = {};
    let result = JSON.parse(JSON.stringify(await pool.query("call listarInfraestructuras(?);", [area])));

    instalaciones.infraestructuras = result[0];
    console.log(instalaciones);
    instalaciones.area = area;
    links.redirect = req.originalUrl;
    let file_name = ''.concat(instalaciones.infraestructuras[0].planta," - ",instalaciones.infraestructuras[0].area);
    console.log(JSON.stringify({'fileName': file_name}));
    let file_export_options = JSON.stringify({'fileName': file_name});
    res.render('facilities/infrastructure/list.hbs', { instalaciones, links, file_export_options });
}

infrastructureCtrl.list = async function (req, res) {
    const instalaciones = {}
    let result = JSON.parse(JSON.stringify(await pool.query("call listarInfraestructuras(?);",['%'])));
    //console.log(result.warningCount);    
    instalaciones.infraestructuras = result[0];
    links.redirect = req.originalUrl;    
    console.log(links);  
    res.render('facilities/infrastructure/list.hbs', { instalaciones, links });    
};

infrastructureCtrl.add = async function (req, res) {
    let card = {
        title: "NUEVA INFRAESTRUCTURA",
        header: "bg-success text-light text-center",
        border: "border-success"
    };

    const instalaciones = {};
    instalaciones.infraestructura = {
        code: 0,
        detalle: "",
        area: "",
        ambiente: "",
        pisonivel: "",
        actualizar: false
    };
    instalaciones.planta = JSON.parse(JSON.stringify(await pool.query("select * from plantas;")));
    instalaciones.area = JSON.parse(JSON.stringify(await pool.query("select * from areas;")));
    instalaciones.ambiente = JSON.parse(JSON.stringify(await pool.query("select * from ambientes;")));
    instalaciones.pisonivel = JSON.parse(JSON.stringify(await pool.query("select * from niveles;")));
    instalaciones.infraestructuras = JSON.parse(JSON.stringify(await pool.query("select * from infraestructuras;")));
    //instalaciones.infraestructura.id=Math.max.apply(Math, instalaciones.infraestructuras.map(function (o) { return o.id; }))+1;
    //console.log(instalaciones);
    //console.log(instalaciones.infraestructuras);
    //let i = Math.max.apply(Math, (instalaciones.infraestructuras.find(o => o.area==='CAL')).map(function (o) { return o.code; }))+1;
    //let i = instalaciones.infraestructuras.filter(obj => obj.area ==='LNE')
    //let i = Math.max.apply(Math, instalaciones.infraestructuras.filter(obj => obj.area ==='CAL').map(function (o) { return o.code; }))+1;
    //console.log(i);
     
    res.render('facilities/infrastructure/edit.hbs', { instalaciones, links, card });
};

infrastructureCtrl.edit = async function (req, res) {
    //console.log(req.headers.referer);
    let card = {
        title: "EDITAR INFRAESTRUCTURA",
        header: "bg-info text-light text-center",
        border: "border-info",
        return: ""
    };
    let { edit } = req.query;    

    if (edit){

        let data={};
        data.area = edit.match(/^(\D\D\D)/g)[0];
        data.codigo = Number(edit.match(/(\d\d)/g)[0]);
        
        let result = await pool.query("select * from Infraestructuras where area=? and codigo=?;", [data.area,data.codigo]);
        //console.log(result);
        const instalaciones = {};
        if (result.length > 0) {
            instalaciones.infraestructura = JSON.parse(JSON.stringify(result[0]));
            instalaciones.infraestructura.actualizar = true;
            instalaciones.planta = JSON.parse(JSON.stringify(await pool.query("select * from plantas;")));
            instalaciones.area = JSON.parse(JSON.stringify(await pool.query("select * from areas;")));
            instalaciones.ambiente = JSON.parse(JSON.stringify(await pool.query("select * from ambientes;")));
            instalaciones.pisonivel = JSON.parse(JSON.stringify(await pool.query("select * from niveles;")));
            instalaciones.infraestructuras = JSON.parse(JSON.stringify(await pool.query("select * from infraestructuras where area=?;",[data.area])));
            //console.log(instalaciones);              
            console.log(links);        
            res.render('facilities/infrastructure/edit.hbs', { instalaciones, links, card });
        }    
    }
    
};

infrastructureCtrl.save = async function (req, res) {
    var infraestructura = JSON.parse(JSON.stringify(req.body.infraestructura));

    console.log(infraestructura);
    if (infraestructura.codigo > 0 && infraestructura.codigo < 100 && infraestructura.area != "") {
        let result = await pool.query("call agregarInfraestructura(?,?);", [infraestructura.codigo, infraestructura.area]);
        if (result.affectedRows > 0) {
            let result = await pool.query("call actualizarInfraestructura(?,?,?,?,?);", [infraestructura.codigo, infraestructura.area, infraestructura.detalle, infraestructura.ambiente, infraestructura.pisonivel]);
            if (result.affectedRows > 0) res.send();
            else res.sendStatus(500);
        }
        else res.sendStatus(500);
    }
    else res.sendStatus(500);
};

infrastructureCtrl.update = async function (req, res) {
    let areas = await pool.query("SELECT  * FROM db_EquiposeInfraestructura_V1.Area;");
    let ambientes = await pool.query("SELECT  * FROM db_EquiposeInfraestructura_V1.tipoAmbiente;");
    let pisoniveles = await pool.query("SELECT  * FROM db_EquiposeInfraestructura_V1.tipoPisoNivel;");

    var infraestructura = JSON.parse(JSON.stringify(req.body.infraestructura));
    //console.log(infraestructura);

    let data={};
    
    let index_area = areas.findIndex(x => x.codigo === infraestructura.area);
    let index_ambiente = ambientes.findIndex(x => x.codigo === infraestructura.ambiente);
    let index_pisonivel = pisoniveles.findIndex(x => x.codigo === infraestructura.pisonivel);

    if (index_area!=-1 && index_ambiente!=-1 && index_pisonivel!=-1){
        data.codigo = Number(infraestructura.codigo);
        data.detalle = infraestructura.detalle;
        data.area = areas[index_area].id;
        data.ambiente = ambientes[index_ambiente].id;
        data.pisonivel = pisoniveles[index_pisonivel].id;
        //console.log(data);

        let result = await pool.query("call actualizarInfraestructura(?,?,?,?,?);", [data.codigo, data.area, data.detalle, data.ambiente, data.pisonivel]);
        //console.log(result);
        if (result.affectedRows > 0) 
            res.sendStatus(200);
        else 
            res.sendStatus(500);
    }
    else 
        res.sendStatus(500);
};

infrastructureCtrl.delete = async function (req, res) {
    var { codigo, area } = JSON.parse(JSON.stringify(req.body));
    let result = await pool.query("call eliminarInfraestructura(?,?);", [codigo, area]);
    if (result.affectedRows > 0) res.send();
    else res.sendStatus(500).send('Ocurrio un error!');
};
export default infrastructureCtrl;