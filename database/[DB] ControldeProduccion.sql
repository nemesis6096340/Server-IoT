#drop database if exists db_ControldeProduccion_V4;
create database if not exists db_ControldeProduccion_V4;

use db_ControldeProduccion_V4;
/*
==================================================================
TABLA FASES DE PRODUCCION
id: Es el identificativo unico de la fase de produccion
detalle:  Es la descripcion de la fase de produccion
================================================================== 
*/
drop table if exists db_ControldeProduccion_V4.FasesProduccion;
create table db_ControldeProduccion_V4.FasesProduccion(
	id tinyint unsigned not null,
	detalle char(25),
    primary key(id)
);
insert into db_ControldeProduccion_V4.FasesProduccion values(0, 'NO PRODUCCION');
insert into db_ControldeProduccion_V4.FasesProduccion values(1, 'PRE PRODUCCION');
insert into db_ControldeProduccion_V4.FasesProduccion values(2, 'PRODUCCION');
insert into db_ControldeProduccion_V4.FasesProduccion values(3, 'POS PRODUCCION');
select * from db_ControldeProduccion_V4.FasesProduccion;

/*
==================================================================
TABLA ESTADOS DE PRODUCCION
id: Es el identificativo unico del estado de produccion
fase: Indica la fase a la que pertenece el estado de produccion
detalle: Es la descripcion del estado de produccion
visible: Visualiza el estado en el menu de actividades del contador
================================================================== 
*/
drop table if exists db_ControldeProduccion_V4.EstadosProduccion;
create table db_ControldeProduccion_V4.EstadosProduccion(
	id tinyint unsigned not null,
    fase tinyint unsigned not null,
	detalle char(25),
    visible boolean default true,
    primary key(id),
    foreign key(fase) references db_ControldeProduccion_V4.FasesProduccion(id)
);

insert into db_ControldeProduccion_V4.EstadosProduccion values(0,0,'MAQUINA PARADA',false);
insert into db_ControldeProduccion_V4.EstadosProduccion values(1,0,'NUEVA PRODUCCION',false);
insert into db_ControldeProduccion_V4.EstadosProduccion values(2,1,'INICIA PRODUCCION',false);
insert into db_ControldeProduccion_V4.EstadosProduccion values(3,2,'PRODUCIENDO',false);
insert into db_ControldeProduccion_V4.EstadosProduccion values(4,2,'PRODUCION DETENIDA',false);
insert into db_ControldeProduccion_V4.EstadosProduccion values(5,2,'AJUSTANDO MAQUINA',false);
insert into db_ControldeProduccion_V4.EstadosProduccion values(6,2,'FINALIZO PRODUCCION',false);

insert into db_ControldeProduccion_V4.EstadosProduccion values(7,1,'CAMBIO DE FORMATO',true);
insert into db_ControldeProduccion_V4.EstadosProduccion values(8,1,'PUESTA A PUNTO',true);
insert into db_ControldeProduccion_V4.EstadosProduccion values(9,2,'FALLA MAQUINA',true);
insert into db_ControldeProduccion_V4.EstadosProduccion values(10,2,'MANTENIMIENTO CORRECTIVO',true);

insert into db_ControldeProduccion_V4.EstadosProduccion values(11,0,'LIMPIEZA RADICAL',true);
insert into db_ControldeProduccion_V4.EstadosProduccion values(12,0,'MANTENIMIENTO PREVENTIVO',true);

select * from db_ControldeProduccion_V4.EstadosProduccion;

/*
==================================================================
TABLA ACTIVIDADES DE PRODUCCION
id: Es el identificativo unico de la actividad de produccion
detalle:  Es la descripcion de la actividad de produccion
================================================================== 
*/
drop table if exists db_ControldeProduccion_V4.ActividadesProduccion;
create table db_ControldeProduccion_V4.ActividadesProduccion(
	id tinyint unsigned not null,
	detalle char(50),
    primary key(id)
);
insert into db_ControldeProduccion_V4.ActividadesProduccion values(0, 'Actividades por Defecto');

/*
==================================================================
TABLA ESTADOS POR ACTIVIDAD DE PRODUCCION
Agrupa los estados segun la actividad a realizar.
actividad: Es el identificativo unico de la actividad de produccion
estado:  Es la identificador de la actividad de produccion
================================================================== 
*/
drop table if exists db_ControldeProduccion_V4.EstadosporActividadProduccion;
create table db_ControldeProduccion_V4.EstadosporActividadProduccion(
	actividad tinyint unsigned not null,
	estado tinyint unsigned not null,
    primary key(actividad,estado),
    foreign key(actividad) references ActividadesProduccion(id),
    foreign key(estado) references EstadosProduccion(id)
);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 0);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 1);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 2);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 3);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 4);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 5);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 6);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 7);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 8);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 9);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 10);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 11);
insert into db_ControldeProduccion_V4.EstadosporActividadProduccion values(0, 12);
select * from db_ControldeProduccion_V4.EstadosporActividadProduccion;

/*
==================================================================
TABLA CONTADOR DE LA MAQUINA
id: Es el identificativo unico de cada contador por ubicacion
datos: Son los datos actuales de cada contador en formato JSON
eliminado: Flag que indica el borrado logico del registro
================================================================== 
*/
drop table if exists db_ControldeProduccion_V4.Contadores;
create table db_ControldeProduccion_V4.Contadores(
	id smallint unsigned not null,
    datos blob,
    actividad tinyint unsigned default 0,
    eliminado boolean default false,
    primary key(id),
    foreign key(actividad) references db_ControldeProduccion_V4.ActividadesProduccion(id)
);
insert into db_ControldeProduccion_V4.Contadores(id) values (0);
/*
 * {"count":{"hour":0,"incr":1,"max":0,"min":0,"previous":0,"total":0,"turn":0},"id":202,"production":{"hfin":0,"hini":0,"ipro":0,"lote":""},"speed":{"machine":0},"state":{"fase":0,"hreg":0,"iest":0,"status":0}}
 */
select * from db_ControldeProduccion_V4.Contadores;

drop procedure if exists db_ControldeProduccion_V4.agregarContador;
delimiter $;
create procedure db_ControldeProduccion_V4.agregarContador(_id smallint unsigned)
begin
	select replace(c.datos,'"id" : 0',concat('"id" : ',_id)) into @datos from db_ControldeProduccion_V4.Contadores c where id=0 limit 1;
	if( not exists( select c.id from db_ControldeProduccion_V4.Contadores c where c.id = _id limit 1 )) then
		insert into db_ControldeProduccion_V4.Contadores(id, datos) values(_id, @datos);
	else
		if( exists( select c.id from db_ControldeProduccion_V4.Contadores c  where c.id = _id and c.eliminado = true limit 1 )) then
			update db_ControldeProduccion_V4.Contadores c
				set 
					c.eliminado = false,
                    c.datos = @datos
            where c.id = _id;
		end if;
    end if;    
end $;
delimiter ;
call db_ControldeProduccion_V4.agregarContador(201);
call db_ControldeProduccion_V4.agregarContador(202);
call db_ControldeProduccion_V4.agregarContador(101);
select * from db_ControldeProduccion_V4.Contadores;

drop procedure if exists db_ControldeProduccion_V4.actualizarContador;
delimiter $;
create procedure db_ControldeProduccion_V4.actualizarContador(_id smallint unsigned, _datos blob)
begin
	update db_ControldeProduccion_V4.Contadores c
		set  c.datos = _datos
	where c.id = _id and c.eliminado = false;
end $;
delimiter ;

drop procedure if exists db_ControldeProduccion_V4.eliminarContador;
delimiter $;
create procedure db_ControldeProduccion_V4.eliminarContador(_id smallint unsigned)
begin
	if( exists( select c.id from db_ControldeProduccion_V4.Contadores c where c.id = _id limit 1 )) then
		update db_ControldeProduccion_V4.Contadores c set c.eliminado = true where c.id = _id;        
    end if;    
end $;
delimiter ;
call db_ControldeProduccion_V4.eliminarContador(201);
select * from db_ControldeProduccion_V4.Contadores;

/*
==================================================================
TABLA INSTALACIONES, UN CONTADOR EN UNA MAQUINA
id: Es el identificativo unico de cada contador por ubicacion
equipo: El es identificativo del equipo donde se va instalar
eliminado: flag que indica el borrado logico del registro
================================================================== 
*/
drop table if exists db_ControldeProduccion_V4.Instalaciones;
create table if not exists db_ControldeProduccion_V4.Instalaciones(
	id	smallint unsigned not null,
	equipo int unsigned not null,
    eliminado boolean default false,
    primary key(id, equipo),    
    unique key(equipo),
    foreign key(id) references db_ControldeProduccion_V4.Contadores(id),
    foreign key(equipo) references db_EquiposeInfraestructura.codificacionequipos(id)
);

drop procedure if exists db_ControldeProduccion_V4.instalarContador;
delimiter $;
create procedure db_ControldeProduccion_V4.instalarContador(_id smallint unsigned, _equipo int unsigned)
begin
	if( exists( select iei.id from db_EquiposeInfraestructura.Instalaciones iei  where iei.id = _equipo and iei.activo = true limit 1 ) and _id<>0) then
		if( not exists( select i.id from db_ControldeProduccion_V4.Instalaciones i where i.id = _id limit 1 )) then
			insert into db_ControldeProduccion_V4.Instalaciones(id, equipo) values(_id, _equipo); 
		else
			if( exists( select i.id from db_ControldeProduccion_V4.Instalaciones i  where i.id = _id and i.eliminado = true limit 1 )) then
				update db_ControldeProduccion_V4.Instalaciones i
					set i.equipo = _equipo,
						i.eliminado = false
				where i.id = _id;
			else
				update db_ControldeProduccion_V4.Instalaciones  i
					set  i.equipo= _equipo
				where i.id = _id;
			end if;
		end if;
	end if;
end $;
delimiter ;

call db_ControldeProduccion_V4.instalarContador(201,134000);
call db_ControldeProduccion_V4.instalarContador(202,135000);
call db_ControldeProduccion_V4.instalarContador(101,137000);
select * from db_ControldeProduccion_V4.Instalaciones;

/*
==================================================================
TABLA PRODUCCION
id: Es el identificativo unico por cada proceso de produccion
equipo: El es identificativo del equipo donde se va instalar
eliminado: flag que indica el borrado logico del registro
================================================================== 
*/

drop table if exists db_ControldeProduccion_V4.Produccion;
create table db_ControldeProduccion_V4.Produccion(
	id bigint unsigned not null,
    ipro int unsigned not null,
    lote char(15),    
    hini integer unsigned,
    hfin integer unsigned,
    primary key(id)
);


drop table if exists db_ControldeProduccion_V4.ProduccionActual;
create table db_ControldeProduccion_V4.ProduccionActual(
	contador smallint unsigned not null,
    produccion bigint unsigned not null,
    incremento tinyint unsigned default 1,
    conteo_total int unsigned default 0,    
    conteo_anterior int unsigned default 0,
    conteo_turno int unsigned default 0,
    hora_reset int unsigned,
    conteo_hora int unsigned default 0,
    conteo_hora_max int unsigned default 0,
    conteo_hora_min int unsigned default 0,
    velocidad_maquina int unsigned default 0,
    estado_actual tinyint unsigned default 0,
    hora_estado int unsigned,
    primary key(contador),
    foreign key(contador) references db_ControldeProduccion_V4.Contadores(id),
    foreign key(produccion) references db_ControldeProduccion_V4.Produccion(id)
);
select * from db_ControldeProduccion_V4.ProduccionActual;

drop table if exists db_ControldeProduccion_V4.historialProduccion;
create table db_ControldeProduccion_V4.historialProduccion(
	contador smallint unsigned not null,
    produccion bigint unsigned not null,
    incremento tinyint unsigned default 0,
    total_producido int unsigned default 0,
    primary key(contador, produccion),
    foreign key(contador) references db_ControldeProduccion_V4.Contadores(id),
    foreign key(produccion) references db_ControldeProduccion_V4.Produccion(id)
);

drop table if exists db_ControldeProduccion_V4.historialCantidadesTurno;
create table db_ControldeProduccion_V4.historialCantidadesTurno(
    produccion bigint unsigned not null,
    hora_registro int unsigned not null,
    conteo_turno int unsigned default 0,
    primary key(produccion, hora_registro),    
    foreign key(produccion) references db_ControldeProduccion_V4.Produccion(id)
);

drop table if exists db_ControldeProduccion_V4.historialCantidadesHora;
create table db_ControldeProduccion_V4.historialCantidadesHora(
    produccion bigint unsigned unsigned not null,
    hora_registro int unsigned not null,
    conteo_hora int unsigned not null,
    primary key(produccion, hora_registro),    
    foreign key(produccion) references db_ControldeProduccion_V4.Produccion(id)
);

drop table if exists db_ControldeProduccion_V4.historialEventos;
create table db_ControldeProduccion_V4.historialEventos(
    produccion bigint unsigned not null,
    hora_registro int unsigned not null,
    conteo_total int unsigned not null,
    estado_actual tinyint unsigned not null,
    primary key(produccion, hora_registro),    
    foreign key(produccion) references db_ControldeProduccion_V4.Produccion(id),
    foreign key(estado_actual) references db_ControldeProduccion_V4.EstadosProduccion(id)
);

drop procedure if exists db_ControldeProduccion_V4.resetearProduccion;
delimiter $;
create procedure db_ControldeProduccion_V4.resetearProduccion(_id smallint unsigned, _ipro int unsigned)
begin
	if( exists( select i.id from db_ControldeProduccion_V4.Instalaciones i where i.id = _id limit 1 )) then
		select pa.produccion into @old_id from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1;
		update historialProduccion hp 
			set
				hp.incremento = (select pa.incremento from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1),
				hp.total_producido = (select pa.conteo_total from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1)
			where 
				hp.contador = _contador and hp.produccion = @old_id;    
		if(_ipro = 0) then
			set _ipro = unix_timestamp();
		end if;
		select _ipro + _contador * 0xffffffff into @new_id;
		insert into db_ControldeProduccion_V4.Produccion(id, ipro) values(@new_id,_ipro);
		insert into db_ControldeProduccion_V4.historialProduccion(contador, produccion) values(_contador, @new_id);
		replace into db_ControldeProduccion_V4.ProduccionActual(contador, produccion) values(_contador, @new_id);
    end if;
end $;
delimiter ;

#call db_ControldeProduccion_V4.resetearProduccion(201, unix_timestamp(), unix_timestamp());

drop procedure if exists db_ControldeProduccion_V4.NuevaProduccion;
delimiter $;
create procedure db_ControldeProduccion_V4.NuevaProduccion(_id smallint unsigned, _ipro int unsigned, _lote char(15))
begin
	call db_ControldeProduccion_V4.resetearProduccion(_id, _ipro);
	if( exists( select i.id from db_ControldeProduccion_V4.Instalaciones i where i.id = _id limit 1 )) then
		select pa.produccion into @id from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1;
        update db_ControldeProduccion_V4.Produccion p
			set p.lote = _lote
            where p.id = @id and p.ipro = _ipro;
    end if;
end $;
delimiter ;

#call db_ControldeProduccion_V4.NuevaProduccion(202, unix_timestamp(), '123456');

drop procedure if exists db_ControldeProduccion_V4.IniciarProduccion;
delimiter $;
create procedure db_ControldeProduccion_V4.IniciarProduccion(_id smallint unsigned, _ipro int unsigned, _hini int unsigned, _incr tinyint unsigned)
begin
	if( exists( select i.id from db_ControldeProduccion_V4.Instalaciones i where i.id = _id limit 1 )) then
		select pa.produccion into @id from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1;
        update db_ControldeProduccion_V4.Produccion p
			set p.hini = _hini
            where p.id = @id and p.ipro = _ipro;
		update db_ControldeProduccion_V4.HistorialProduccion hp
			set hp.incremento = _incr
            where hp.produccion = @id;
    end if;
end $;
delimiter ;

drop procedure if exists db_ControldeProduccion_V4.FinalizarProduccion;
delimiter $;
create procedure db_ControldeProduccion_V4.FinalizarProduccion(_id smallint unsigned, _ipro int unsigned, _hfin int unsigned)
begin
	if( exists( select i.id from db_ControldeProduccion_V4.Instalaciones i where i.id = _id limit 1 )) then
		select pa.produccion into @id from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1;
        update db_ControldeProduccion_V4.Produccion p
			set p.hfin = _hfin
            where p.id = @id and p.ipro = _ipro;
		update db_ControldeProduccion_V4.HistorialProduccion hp
			set hp.incremento = (select pa.incremento from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1),
			    hp.total_producido = (select pa.conteo_total from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1)
            where hp.id = @id;
    end if;
end $;
delimiter ;

drop procedure if exists db_ControldeProduccion_V4.insertarConteoTurno;
delimiter $;
create procedure db_ControldeProduccion_V4.insertarConteoTurno(_id smallint unsigned, _hreg int unsigned, _total int unsigned)
begin
	if( exists( select i.id from db_ControldeProduccion_V4.Instalaciones i where i.id = _id limit 1 )) then
		select pa.produccion into @id from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1;
        insert into db_ControldeProduccion_V4.historialCantidadesTurno values (@id, _hreg,_total);
        update db_ControldeProduccion_V4.produccionActual set hora_reset = _hreg where contador = _id;
    end if;
end $;
delimiter ;
select * from db_ControldeProduccion_V4.historialCantidadesTurno;
select * from db_ControldeProduccion_V4.produccionActual;

drop procedure if exists db_ControldeProduccion_V4.insertarConteoHora;
delimiter $;
create procedure db_ControldeProduccion_V4.insertarConteoHora(_id smallint unsigned, _hreg int unsigned, _total int unsigned)
begin
	if( exists( select i.id from db_ControldeProduccion_V4.Instalaciones i where i.id = _id limit 1 )) then
		select pa.produccion into @id from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1;
        insert into db_ControldeProduccion_V4.historialCantidadesHora values (@id, _hreg,_total);
    end if;
end $;
delimiter ;
select produccion, from_unixtime(hora_registro), conteo_hora from db_ControldeProduccion_V4.historialCantidadesHora;

drop procedure if exists db_ControldeProduccion_V4.insertarEvento;
delimiter $;
create procedure db_ControldeProduccion_V4.insertarEvento(_id smallint unsigned, _hreg int unsigned, _evento tinyint unsigned)
begin
	if( exists( select i.id from db_ControldeProduccion_V4.Instalaciones i where i.id = _id limit 1 )) then
		select pa.produccion into @id from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1;
        select pa.conteo_total into @total from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1;
        insert into db_ControldeProduccion_V4.historialEventos values (@id, _hreg, @total, _evento);
        update db_ControldeProduccion_V4.ProduccionActual
			set
				estado_actual = _evento,
				hora_estado = _hreg
			where
				contador = _id;
    end if;
end $;
delimiter ;
select * from db_ControldeProduccion_V4.historialEventos;
select * from db_ControldeProduccion_V4.produccionActual;

drop procedure if exists db_ControldeProduccion_V4.actualizarCantidades;
delimiter $;
create procedure db_ControldeProduccion_V4.actualizarConteoActual(
	_id smallint unsigned,
    _incremento tinyint unsigned,
    _conteo_total int unsigned,
    _conteo_anterior int unsigned,
    _conteo_turno int unsigned,
    _conteo_hora int unsigned,
    _conteo_hora_max int unsigned,
    _conteo_hora_min int unsigned,
    _velocidad_maquina int unsigned
    )
begin
	if( exists( select i.id from db_ControldeProduccion_V4.Instalaciones i where i.id = _id limit 1 )) then
		select pa.produccion into @id from db_ControldeProduccion_V4.ProduccionActual pa  where pa.contador = _id limit 1;
        update db_ControldeProduccion_V4.ProduccionActual
			set
				incremento = _incremento,
				conteo_total = _conteo_total,
				conteo_anterior = _conteo_anterior,
				conteo_turno = _conteo_turno,
				conteo_hora =_conteo_hora,
				conteo_hora_max =_conteo_hora_max,
				conteo_hora_min =_conteo_hora_min,
				velocidad_maquina = _velocidad_maquina
			where
				contador = _id;
    end if;
end $;
delimiter ;
select * from db_controldeproduccion_v4.produccionActual;

drop view if exists db_ControldeProduccion_V4.mostrarContadores;
create view db_ControldeProduccion_V4.mostrarContadores
as 
select
	c.id as 'id',
    CAST(c.datos AS CHAR(10000) CHARACTER SET utf8) as 'data',
    c.actividad as 'activity',
    CONCAT(u.area,'-',lpad(ce.id DIV 1000, 3, 0),' ',lpad(ce.id MOD 1000, 3, 0)) as 'code',
    ce.objeto as 'equipment',    
    a.detalle as 'area',
    u.detalle as 'ubicacion'
from db_ControldeProduccion_V4.Contadores c
left join db_ControldeProduccion_V4.Instalaciones i on i.id = c.id
left join db_EquiposeInfraestructura.codificacionequipos ce on ce.id = i.equipo
left join db_EquiposeInfraestructura.Instalaciones cei on cei.id = ce.id
left join db_EquiposeInfraestructura.CodificacionInfraestructura u on u.id = cei.ubicacion
left join db_EquiposeInfraestructura.Area a on a.codigo = u.area

where i.eliminado = false;

select * from db_ControldeProduccion_V4.mostrarContadores;

select distinct area from db_ControldeProduccion_V4.mostrarContadores;
select * from db_ControldeProduccion_V4.produccion;
select * from db_ControldeProduccion_V4.produccionActual;
select * from db_ControldeProduccion_V4.historialProduccion;
select * from db_ControldeProduccion_V4.historialEventos;
select * from db_ControldeProduccion_V4.historialCantidadesHora;
select produccion, from_unixtime(hora_registro), conteo_hora from db_ControldeProduccion_V4.historialCantidadesHora;
select produccion, from_unixtime(hora_registro), conteo_total, estado_actual from db_ControldeProduccion_V4.historialEventos;