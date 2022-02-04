#create database if not exists db_UsuariosySesiones;

drop table if exists db_UsuariosySesiones.Usuarios;
/*
==================================================================
TABLA USUARIOS
id: Es el identificativo unico que se le asigna a un nuevo usuario
username: Es el nombre o nick del usuario
email: Es el correo electronico de cada usuario. Cifrado(bcrypt)
password: Es la contraseña de cada usuario. Cifrado(bcrypt)
role: Son los roles de usuario, permisos, etc. Son datos tipo JSON
================================================================== 
*/

/*drop table if exists db_UsuariosySesiones.users;*/
create table db_UsuariosySesiones.users(
	id int unsigned not null,
    code int unsigned not null,
	username blob,
    email blob,
    password blob,
    role blob,
    primary key(id),
    unique key(code)   
);


insert into db_usuariosysesiones.users (id,code,username,email,password,role) values(1640995200,2641,'Acarapi Mamani, Huber','hacarapi@cofar.com.bo','$2a$10$mTvBt12rlkd8vTg7STGMbu2L76HgKLXTHviCMuZcoYEl8bjWJ3b8q','Administrador');
insert into db_usuariosysesiones.users (id,code,username,email,password,role) values(1643596391,1234,'Jemio Nogales, Gustavo','gjemio@cofar.com.bo','$2a$10$EgQIXxuYOpYpYAp8dmDYguxt64cVgawJ/QyBeZebzRnNHvMAxVxIi','Encargado');
insert into db_usuariosysesiones.users (id,code,username,email,password,role) values(1643596399,4321,'Santalla Maydana, Fernando','fsantalla@cofar.com.bo','$2a$10$Fn4fFQ8Iu0wLh1ttnHr8tufykq7uWuW0G0MmATvXYqOy9VHpEL5o2','Supervisor');
select * from db_usuariosysesiones.users;

select * from usuarios;
select * from solicitudes;

select * from db_UsuariosySesiones.sessions;
show tables from db_UsuariosySesiones;

drop table if exists db_UsuariosySesiones.roles;
create table db_UsuariosySesiones.roles(
	id int unsigned not null,
    rolename blob,
	datalogger tinyint unsigned default 24,
    production tinyint unsigned default 24,
    capture tinyint unsigned default 24,
    facilities tinyint unsigned default 24,
    devices tinyint unsigned default 0,
    users tinyint unsigned default 0,
    supervisor tinyint unsigned default 0,
    operator tinyint unsigned default 0,
    primary key(id)
);

select * from db_UsuariosySesiones.roles;

insert into db_UsuariosySesiones.roles(id, rolename) value(0, 'Operador');
insert into db_UsuariosySesiones.roles(id, rolename) value(1, 'Supervisor');
insert into db_UsuariosySesiones.roles(id, rolename) value(2, 'Administrador');

update
    db_UsuariosySesiones.roles
set 
    datalogger = 254,
    production = 254,
    capture = 254,
    facilities = 254,
    devices = 254,
    users = 254,
    supervisor = 254,
    operator = 254
    where id = 2;
