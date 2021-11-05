#create database if not exists db_UsuariosySesiones;

drop table if exists db_UsuariosySesiones.Usuarios;
/*
==================================================================
TABLA USUARIOS
id: Es el identificativo unico que se le asigna a un nuevo usuario
user: Es el nombre o nick del usuario
email: Es el correo electronico de cada usuario. Cifrado(bcrypt)
role: Son los roles de usuario, permisos, etc. Son datos tipo JSON
================================================================== 
*/

drop table if exists db_UsuariosySesiones.users;

create table db_UsuariosySesiones.users(
	id int unsigned not null,
	user blob,
    email blob,
    pass blob,
    role blob,
    primary key(id)    
);