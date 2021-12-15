import pool from "../database.js";

const zonas = {};

export const getLocations = async function(){
    const infraestructuras = {};
    infraestructuras.plantas = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura_v1.plantas;")));
    infraestructuras.areas = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura_v1.areas;")));
    infraestructuras.ubicaciones = JSON.parse(JSON.stringify(await pool.query("select * from db_EquiposeInfraestructura_v1.ubicaciones;")));

    zonas.plantas = [];
    infraestructuras.plantas.forEach(function(planta) {
        let {codigo, descripcion} = planta;
        let areas = [];
        infraestructuras.areas.forEach(function(area) {
            if(area.planta === planta.codigo){
                let new_area = {};
                new_area.codigo = area.codigo;
                new_area.descripcion = area.descripcion;
                let ubicaciones = [];
                infraestructuras.ubicaciones.forEach(function(ubicacion) {
                    if(ubicacion.area === area.codigo){
                        let new_ubicacion = {};
                        new_ubicacion.codigo = ubicacion.codigo;
                        new_ubicacion.descripcion = ubicacion.descripcion;
                        ubicaciones.push(new_ubicacion);
                    }
                });
                new_area.ubicaciones = ubicaciones;
                console.log(new_area);
                areas.push(new_area);
            }
        });
        zonas.plantas.push({codigo, descripcion, areas});
    });
    return zonas;
}
