#DROP DATABASE IF EXISTS db_EquiposeInfraestructura_V1;
CREATE DATABASE IF NOT EXISTS db_EquiposeInfraestructura_V1;
/**************************************************************************
* TABLA PLANTA
***************************************************************************/
DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.Planta;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.Planta(
  id INTEGER UNSIGNED NOT NULL,
  codigo CHAR(5) NOT NULL,
  detalle CHAR(50) DEFAULT '',
  eliminado BOOLEAN DEFAULT false,
  orden INTEGER UNSIGNED DEFAULT 0,
  PRIMARY KEY(id),
  UNIQUE KEY(codigo)
);
INSERT INTO db_EquiposeInfraestructura_V1.Planta(id, codigo, detalle) VALUES(1, 'MF', 'Planta Miraflores');
INSERT INTO db_EquiposeInfraestructura_V1.Planta(id, codigo, detalle) VALUES(2, 'QZ', 'Planta Quintanilla Suazo');
INSERT INTO db_EquiposeInfraestructura_V1.Planta(id, codigo, detalle) VALUES(3, 'EA', 'Planta El Alto');
SELECT * FROM db_EquiposeInfraestructura_V1.Planta;
/**************************************************************************
* TABLA AREAS
***************************************************************************/
DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.Area;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.Area(
    id INTEGER UNSIGNED NOT NULL,
    codigo CHAR(5) NOT NULL,
    detalle CHAR(60) DEFAULT '',
    planta INTEGER UNSIGNED NOT NULL,
    eliminado BOOLEAN DEFAULT false,
    orden INTEGER UNSIGNED DEFAULT 0,
    PRIMARY KEY(id),
    UNIQUE KEY(codigo),
    FOREIGN KEY(planta) REFERENCES db_EquiposeInfraestructura_V1.Planta(id)
  );
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(1, 'ACD', 'Acondicionamiento', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(2, 'ACI', 'Acondicionamiento de InyecTABLEs', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(3, 'ADM', 'Administracion', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(4, 'AMP', 'Almacén de Materia Prima', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(5, 'AEA', 'Almacén de Materia Prima anexo El Alto', 3);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(6, 'APT', 'Almacén de Producto Terminado', 2);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(7, 'ASC', 'Asceguramiento de la calidad', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(8, 'CMC', 'Comercial', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(9, 'CC', 'Control de Calidad', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(10, 'DES', 'Desarrollo', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(11, 'IND', 'Industrial', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(12, 'LE', 'Líquidos Estériles', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(13, 'LNE', 'Líquidos No Estériles', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(14, 'MAN', 'Mantenimiento', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(15, 'PES', 'Pesaje', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(16, 'SMS', 'Semisolidos', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(17, 'SAC', 'Servicio de Apoyo Critico', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(18, 'SGE', 'Servicios Generales', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(19, 'SCP', 'Sistemas-TI, Contabilidad, Presupuestos, Operaciones', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(20, 'SNE', 'Sólidos No Estériles', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(21, 'SIMA', 'Seguridad Industrial y Medio Ambiente', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(22, 'SPT', 'Soporte a la manufactura', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(23, 'MCB', 'Microbiologia', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(24, 'CAL', 'Calibraciones', 1);
INSERT INTO db_EquiposeInfraestructura_V1.Area(id, codigo, detalle, planta) VALUES(25, 'VAL', 'Validaciones', 1);
SELECT  * FROM db_EquiposeInfraestructura_V1.Area;

/**************************************************************************
* TABLA AMBIENTE
***************************************************************************/
DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.tipoAmbiente;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.tipoAmbiente(
    id INTEGER UNSIGNED NOT NULL,
    codigo CHAR(2) NOT NULL,
    detalle CHAR(50) DEFAULT '',
    eliminado BOOLEAN DEFAULT false,
    PRIMARY KEY(id),
    UNIQUE KEY(codigo)
  );
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(1, 'P', 'Sala de proceso');
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(2, 'E', 'Sala de empaque primario o envasado');
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(3, 'A', 'Sala de empaque secundario o acondicionado');
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(4, 'O', 'Oficina');
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(5, 'H', 'Pasillo, graderia, corredor, patio');
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(6, 'L', 'Sala de almacenamiento');
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(7, 'T', 'Sala técnica');
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(8, 'G', 'Garaje');
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(9, 'S', 'Servicios sanitarios');
INSERT INTO db_EquiposeInfraestructura_V1.tipoAmbiente(id, codigo, detalle) VALUES(10, 'V', 'Vestidor, esclusa');
SELECT * FROM db_EquiposeInfraestructura_V1.tipoAmbiente;

/**************************************************************************
 * TABLA TIPO PISO O NIVEL
 ***************************************************************************/
DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.tipoPisoNivel;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.tipoPisoNivel(
    id INTEGER UNSIGNED NOT NULL,
    codigo CHAR(2) NOT NULL,
    detalle CHAR(50) DEFAULT '',
    eliminado BOOLEAN DEFAULT false,
    PRIMARY KEY(id),
    UNIQUE KEY(codigo)
  );
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(1,'A', 'Planta Baja');
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(2,'B', 'Primer Piso');
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(3,'C', 'Segundo Piso');
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(4,'D', 'Tercer Piso');
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(5,'E', 'Subsuelo');
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(6,'F', '2do Subsuelo');
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(7,'G', '3er Subsuelo');
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(8,'H', '4to Subsuelo');
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(9,'I', '5to Subsuelo');
INSERT INTO db_EquiposeInfraestructura_V1.tipoPisoNivel(id, codigo, detalle) VALUES(10,'J', '6to Subsuelo');
SELECT * FROM db_EquiposeInfraestructura_V1.tipoPisoNivel;
/**************************************************************************
 * TABLA CODIFICACION INFRAESTRUCTURA
 ***************************************************************************/
DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.CodificacionInfraestructura;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.CodificacionInfraestructura(
    id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,    
    codigo INTEGER UNSIGNED NOT NULL,
    area INTEGER UNSIGNED NOT NULL,
    detalle CHAR(100) DEFAULT '',
    ambiente INTEGER UNSIGNED NOT NULL,
    pisonivel INTEGER UNSIGNED NOT NULL,
    eliminado BOOLEAN DEFAULT false,
    PRIMARY KEY(id),
    UNIQUE KEY(codigo, area),
    FOREIGN KEY(area) REFERENCES db_EquiposeInfraestructura_V1.Area(id),
    FOREIGN KEY(ambiente) REFERENCES db_EquiposeInfraestructura_V1.tipoAmbiente(id),
    FOREIGN KEY(pisonivel) REFERENCES db_EquiposeInfraestructura_V1.tipoPisoNivel(id)
);
DESCRIBE db_EquiposeInfraestructura_V1.CodificacionInfraestructura
SELECT * FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura;

DROP VIEW IF EXISTS db_EquiposeInfraestructura_V1.Infraestructuras;
CREATE VIEW db_EquiposeInfraestructura_V1.Infraestructuras as
SELECT 
    ci.id, 
    a.codigo as 'area',
    p.codigo as 'planta',
    concat(a.codigo,' ',lpad(ci.codigo, 2, 0),' ', ta.codigo, tpn.codigo ) as 'codigo',
    ci.detalle as 'detalle',
    ta.detalle as 'ambiente',
    tpn.detalle as 'pisonivel'
FROM
  db_EquiposeInfraestructura_V1.CodificacionInfraestructura ci
  INNER JOIN db_EquiposeInfraestructura_V1.tipoAmbiente ta on ta.id = ci.ambiente
  INNER JOIN db_EquiposeInfraestructura_V1.tipoPisoNivel tpn on tpn.id = ci.pisonivel
  INNER JOIN db_EquiposeInfraestructura_V1.area a on a.id = ci.area
  INNER JOIN db_EquiposeInfraestructura_V1.planta p on p.id = a.planta
WHERE ci.eliminado = false
ORDER BY  a.planta,  ci.area, ci.codigo;

SELECT * FROM db_EquiposeInfraestructura_V1.Infraestructuras;
DROP PROCEDURE IF EXISTS db_EquiposeInfraestructura_V1.agregarInfraestructura;
DELIMITER $;
CREATE PROCEDURE db_EquiposeInfraestructura_V1.agregarInfraestructura(_codigo INTEGER UNSIGNED, _area INTEGER UNSIGNED)
BEGIN    
    IF(NOT EXISTS(SELECT ci.codigo, ci.area FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura ci WHERE ci.codigo = _codigo AND ci.area = _area limit 1)) THEN   INSERT INTO db_EquiposeInfraestructura_V1.CodificacionInfraestructura(codigo, area) VALUES(_codigo, _area);
    ELSE IF(EXISTS(SELECT ci.codigo, ci.area FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura ci WHERE ci.codigo = _codigo AND ci.area = _area AND ci.eliminado = true limit 1)) THEN   UPDATE db_EquiposeInfraestructura_V1.CodificacionInfraestructura ci SET ci.eliminado = false WHERE ci.codigo = _codigo AND ci.area = _area;    END IF;
     END IF;
 END $;

DELIMITER ;
DROP PROCEDURE IF EXISTS db_EquiposeInfraestructura_V1.actualizarInfraestructura;
DELIMITER $;
CREATE PROCEDURE db_EquiposeInfraestructura_V1.actualizarInfraestructura(_codigo INTEGER UNSIGNED, _area INTEGER UNSIGNED, _detalle CHAR(100), _ambiente INTEGER UNSIGNED, _pisonivel INTEGER UNSIGNED)
BEGIN
    IF(EXISTS(SELECT ci.codigo, ci.area FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura ci WHERE ci.codigo = _codigo AND ci.area = _area AND ci.eliminado = true limit 1)) THEN   SELECT ci.id INTO @id FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura ci WHERE ci.code = _codigo  AND ci.area = _area limit 1;   UPDATE db_EquiposeInfraestructura_V1.CodificacionInfraestructura ci    SET  ci.detalle = _detalle,  ci.ambiente = _ambiente,  ci.pisonivel = _pisonivel   WHERE ci.id = @id AND ci.eliminado = false;
     END IF
 END $;
DELIMITER;
DROP PROCEDURE IF EXISTS db_EquiposeInfraestructura_V1.eliminarInfraestructura;
DELIMITER $;
CREATE PROCEDURE db_EquiposeInfraestructura_V1.eliminarInfraestructura(_codigo INTEGER UNSIGNED, _area INTEGER UNSIGNED)
BEGIN 
    IF(EXISTS(SELECT ci.codigo, ci.area FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura ci WHERE ci.codigo = _codigo AND ci.area = _area LIMIT 1)) THEN   SELECT ci.id INTO @id FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura ci WHERE ci.code = _codigo  AND ci.area = _area limit 1;   UPDATE db_EquiposeInfraestructura_V1.CodificacionInfraestructura i   SET i.eliminado = true   WHERE ci.id = @id;
     END IF;
 END $;
DELIMITER ;

/********************************************************************************
						DESCRIPCION DE EQUIPOS
*********************************************************************************/
DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.ClasificacionPrimaria;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.ClasificacionPrimaria(
  desde INTEGER UNSIGNED NOT NULL,
  hasta INTEGER UNSIGNED NOT NULL,
  detalle CHAR(60) DEFAULT '',
  eliminado BOOLEAN DEFAULT false,
  PRIMARY KEY(desde, hasta)
);
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionPrimaria(desde, hasta, detalle) VALUES(001, 500, 'Equipos');
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionPrimaria(desde, hasta, detalle) VALUES(501, 800, 'Equipos de medición');
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionPrimaria(desde, hasta, detalle) VALUES(801, 999, 'Instalaciones');
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionPrimaria(desde, hasta, detalle) VALUES(1000,1999,'Equipos de medición de clasificación especial (*)');

SELECT * FROM db_EquiposeInfraestructura_V1.ClasificacionPrimaria;

DROP FUNCTION IF EXISTS db_EquiposeInfraestructura_V1.getClase;
DELIMITER $;
CREATE FUNCTION db_EquiposeInfraestructura_V1.getClase(numero INTEGER UNSIGNED) returns CHAR(60)
BEGIN 
    DECLARE clase CHAR(60);
    SELECT p.detalle into clase
    FROM db_EquiposeInfraestructura_V1.ClasificacionPrimaria p
    WHERE numero BETWEEN p.desde AND p.hasta 
    LIMIt 1;
RETURN clase;
 END $;
DELIMITER;
SELECT  db_EquiposeInfraestructura_V1.getClase(005000 / 1000);

DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.ClasificacionSecundaria;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.ClasificacionSecundaria(
    desde INTEGER UNSIGNED NOT NULL,
    hasta INTEGER UNSIGNED NOT NULL,
    detalle CHAR(60) DEFAULT '',
    eliminado BOOLEAN DEFAULT false,
    PRIMARY KEY(desde, hasta)
  );
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionSecundaria(desde, hasta, detalle) VALUES(000, 000, 'Principal');
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionSecundaria(desde, hasta, detalle) VALUES(001, 099, 'General');
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionSecundaria(desde, hasta, detalle) VALUES(100, 199, 'Sistemas de Control');
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionSecundaria(desde, hasta, detalle) VALUES(200, 299, 'Sistema Eléctrico');
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionSecundaria(desde, hasta, detalle) VALUES(300, 399, 'Sistema Mecánico');
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionSecundaria(desde, hasta, detalle) VALUES(400, 499, 'Sistema Térmico');
INSERT INTO db_EquiposeInfraestructura_V1.ClasificacionSecundaria(desde, hasta, detalle) VALUES(500, 599, 'Instrumentación');
SELECT  * FROM db_EquiposeInfraestructura_V1.ClasificacionSecundaria;
DROP FUNCTION IF EXISTS db_EquiposeInfraestructura_V1.getModulo;
DELIMITER $;
CREATE FUNCTION db_EquiposeInfraestructura_V1.getModulo(numero INTEGER UNSIGNED) RETURNS CHAR(60)
BEGIN
    DECLARE modulo CHAR(60);
    SELECT s.detalle into modulo FROM db_EquiposeInfraestructura_V1.ClasificacionSecundaria s WHERE numero BETWEEN s.desde AND s.hasta LIMIT 1;
    RETURN modulo;
 END $;
DELIMITER ;
SELECT db_EquiposeInfraestructura_V1.getModulo(005001 % 1000);

DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.TipodeCalibracion;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.TipodeCalibracion(
    id INTEGER UNSIGNED NOT NULL,
    detalle CHAR(60) DEFAULT '',
    eliminado BOOLEAN DEFAULT false,
    PRIMARY KEY(id)
  );
INSERT INTO db_EquiposeInfraestructura_V1.TipodeCalibracion(id, detalle) VALUES(0, 'No Aplica');
INSERT INTO db_EquiposeInfraestructura_V1.TipodeCalibracion(id, detalle) VALUES(1, 'Calibración Interna');
INSERT INTO db_EquiposeInfraestructura_V1.TipodeCalibracion(id, detalle) VALUES(2, 'Calibración Externa');
SELECT * FROM db_EquiposeInfraestructura_V1.TipodeCalibracion;
DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.TipodeEquipo;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.TipodeEquipo(
    id INTEGER UNSIGNED NOT NULL,
    detalle CHAR(50) DEFAULT '',
    eliminado BOOLEAN DEFAULT false,
    PRIMARY KEY(id)
  );
INSERT INTO db_EquiposeInfraestructura_V1.TipodeEquipo(id, detalle) VALUES(0, 'Ninguno');
INSERT INTO db_EquiposeInfraestructura_V1.TipodeEquipo(id, detalle) VALUES(1, 'Balanza');
INSERT INTO db_EquiposeInfraestructura_V1.TipodeEquipo(id, detalle) VALUES(2, 'Maquina');
INSERT INTO db_EquiposeInfraestructura_V1.TipodeEquipo(id, detalle) VALUES(3, 'Impresora');
INSERT INTO db_EquiposeInfraestructura_V1.TipodeEquipo(id, detalle) VALUES(4, 'Sensor');
INSERT INTO db_EquiposeInfraestructura_V1.TipodeEquipo(id, detalle) VALUES(5, 'Banda Transportadora');
INSERT INTO db_EquiposeInfraestructura_V1.TipodeEquipo(id, detalle) VALUES(6, 'Codificador');
SELECT * FROM db_EquiposeInfraestructura_V1.TipodeEquipo;


DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.CodificacionEquipos;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.CodificacionEquipos(
    id INTEGER UNSIGNED NOT NULL,
    gmp BOOLEAN DEFAULT false,
    objeto CHAR(100) DEFAULT '',
    elemento CHAR(100) DEFAULT '',
    caracteristicas text,
    calibracion INTEGER UNSIGNED DEFAULT 0,
    tipo INTEGER UNSIGNED DEFAULT 0,
    eliminado BOOLEAN DEFAULT false,
    PRIMARY KEY(id),
    FOREIGN KEY(calibracion) REFERENCES db_EquiposeInfraestructura_V1.TipodeCalibracion(id),
    FOREIGN KEY(tipo) REFERENCES db_EquiposeInfraestructura_V1.TipodeEquipo(id)
);

#INSERT INTO db_equiposeinfraestructura_V1.CodificacionEquipos
#    SELECT * FROM db_EquiposeInfraestructura.CodificacionEquipos;

SELECT * FROM db_equiposeinfraestructura_V1.CodificacionEquipos;
DROP PROCEDURE IF EXISTS db_EquiposeInfraestructura_V1.agregarEquipo;
DELIMITER $;
CREATE PROCEDURE db_EquiposeInfraestructura_V1.agregarEquipo(_id INTEGER UNSIGNED)
BEGIN 
    IF(NOT EXISTS(SELECT e.id FROM db_EquiposeInfraestructura_V1.CodificacionEquipos e WHERE e.id = _id LIMIT 1)) THEN   INSERT INTO db_EquiposeInfraestructura_V1.CodificacionEquipos(id) VALUES(_id);
    ELSE    IF(EXISTS(SELECT e.id FROM db_EquiposeInfraestructura_V1.CodificacionEquipos e WHERE e.id = _id AND e.eliminado = true LIMIT 1)) THEN       UPDATE db_EquiposeInfraestructura_V1.CodificacionEquipos e SET e.eliminado = false WHERE e.id = _id;    END IF;
     END IF;
 END $;
DELIMITER ;
call db_EquiposeInfraestructura_V1.agregarEquipo(583000);
SELECT * FROM db_EquiposeInfraestructura_V1.CodificacionEquipos;
DROP PROCEDURE IF EXISTS db_EquiposeInfraestructura_V1.actualizarEquipo;
DELIMITER $;
CREATE PROCEDURE db_EquiposeInfraestructura_V1.actualizarEquipo(_id INTEGER UNSIGNED, _gmp BOOLEAN, _objeto CHAR(100), _elemento CHAR(100), _caracteristicas text, _calibracion INTEGER UNSIGNED, _tipo INTEGER UNSIGNED)
  BEGIN
    UPDATE db_EquiposeInfraestructura_V1.CodificacionEquipos e SET e.gmp = _gmp, e.objeto = _objeto, e.elemento = _elemento, e.caracteristicas = _caracteristicas, e.calibracion = _calibracion, e.tipo = _tipo
    WHERE e.id = _id AND e.eliminado = false;
  END $;
DELIMITER;
DROP PROCEDURE IF EXISTS db_EquiposeInfraestructura_V1.eliminarEquipo;
DELIMITER $;
CREATE PROCEDURE db_EquiposeInfraestructura_V1.eliminarEquipo(_id INTEGER UNSIGNED)
  BEGIN 
    IF(EXISTS(SELECT e.id FROM db_EquiposeInfraestructura_V1.CodificacionEquipos e WHERE e.id = _id limit 1)) THEN
      UPDATE db_EquiposeInfraestructura_V1.CodificacionEquipos e SET e.eliminado = true WHERE e.id = _id;
      #UPDATE db_EquiposeInfraestructura_V1.instalaciones i SET i.eliminado = true WHERE i.id = _id;
    END IF;
END $;
DELIMITER;
call db_EquiposeInfraestructura_V1.agregarEquipo(583000);
call db_EquiposeInfraestructura_V1.eliminarEquipo(583000);
SELECT * FROM db_EquiposeInfraestructura_V1.CodificacionEquipos;
UPDATE db_EquiposeInfraestructura_V1.CodificacionEquipos SET elemento = "General" WHERE id > 0;
/****************************************************************************
* TABLA INSTALACIONES
****************************************************************************/
SHOW ENGINE INNODB STATUS;

DROP TABLE IF EXISTS db_EquiposeInfraestructura_V1.Instalaciones;
CREATE TABLE IF NOT EXISTS db_EquiposeInfraestructura_V1.Instalaciones(
  equipo INTEGER UNSIGNED NOT NULL,
  ubicacion INTEGER UNSIGNED NOT NULL,
  activo BOOLEAN DEFAULT true,
  eliminado BOOLEAN DEFAULT false,
  PRIMARY KEY(equipo),
  FOREIGN KEY(equipo) REFERENCES db_EquiposeInfraestructura_V1.CodificacionEquipos(id),
  FOREIGN KEY(ubicacion) REFERENCES db_EquiposeInfraestructura_V1.CodificacionInfraestructura(id)
);
DESCRIBE db_EquiposeInfraestructura_V1.CodificacionEquipos;
SELECT * FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura;
#ALTER TABLE db_EquiposeInfraestructura_V1.Instalaciones ADD area CHAR(5);
  #ALTER TABLE db_EquiposeInfraestructura_V1.Instalaciones ADD code INTEGER UNSIGNED NOT NULL;
  #SELECT * FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura;
  #SELECT * FROM db_EquiposeInfraestructura_V1.Instalaciones;
  #UPDATE db_EquiposeInfraestructura_V1.Instalaciones as i
  # JOIN db_EquiposeInfraestructura_V1.CodificacionInfraestructura as ci
  # on i.ubicacion=ci.id
  # SET i.code = ci.code, i.area = ci.area
  # WHERE i.id>0;
  #SHOW CREATE TABLE db_EquiposeInfraestructura_V1.Instalaciones;
  #alter TABLE db_EquiposeInfraestructura_V1.Instalaciones DROP FOREIGN KEY instalaciones_ibfk_2;
  #alter TABLE db_EquiposeInfraestructura_V1.CodificacionInfraestructura DROP PRIMARY KEY, add PRIMARY KEY(code, area);
  #alter TABLE db_EquiposeInfraestructura_V1.Instalaciones ADD CONSTRAINT instalaciones_ibfk_2 FOREIGN KEY (code, area) REFERENCES db_EquiposeInfraestructura_V1.CodificacionInfraestructura(code,area);
  #SELECT * FROM db_EquiposeInfraestructura_V1.Instalaciones;
  #ALTER TABLE db_EquiposeInfraestructura_V1.CodificacionInfraestructura DROP COLUMN id;
  #ALTER TABLE db_EquiposeInfraestructura_V1.Instalaciones DROP COLUMN ubicacion;
  #SELECT * FROM db_EquiposeInfraestructura_V1.CodificacionInfraestructura;
  #SELECT * FROM db_EquiposeInfraestructura_V1.Instalaciones;
  #INSERT INTO db_EquiposeInfraestructura_V1.Instalaciones(id, ubicacion) VALUES (557000,6);
  #SELECT * FROM db_EquiposeInfraestructura_V1.Instalaciones;
  DROP PROCEDURE IF EXISTS db_EquiposeInfraestructura_V1.instalarEquipo;
DELIMITER $;
CREATE PROCEDURE db_EquiposeInfraestructura_V1.instalarEquipo(_id INTEGER UNSIGNED, _ubicacion INTEGER UNSIGNED) BEGIN IF(
    NOT EXISTS( SELECT   i.id FROM   db_EquiposeInfraestructura_V1.Instalaciones i WHERE   i.id = _id limit   1
    )
  ) THEN
INSERT INTO
  db_EquiposeInfraestructura_V1.Instalaciones(id, ubicacion)
VALUES(_id, _ubicacion);
  else IF(
    EXISTS( SELECT   i.id FROM   db_EquiposeInfraestructura_V1.Instalaciones i WHERE   i.id = _id   AND i.activo = false limit   1
    )
  ) THEN
UPDATE
  db_EquiposeInfraestructura_V1.Instalaciones i
SET
  i.ubicacion = _ubicacion,
  i.activo = true
WHERE
  i.id = _id;
  else
UPDATE
  db_EquiposeInfraestructura_V1.Instalaciones i
SET
  i.ubicacion = _ubicacion
WHERE
  i.id = _id;
 END IF;
 END IF;
 END $;
DELIMITER;
call db_EquiposeInfraestructura_V1.InstalarEquipo(583000, 1);
SELECT
  *
FROM
  db_EquiposeInfraestructura_V1.instalaciones;
DROP VIEW IF EXISTS db_EquiposeInfraestructura_V1.Equipos;
CREATE VIEW db_EquiposeInfraestructura_V1.Equipos as
SELECT
  a.planta as 'Planta',
  u.area as 'Area',
  concat(
    lpad(e.id DIV 1000, 3, 0),
    ' ',
    lpad(e.id MOD 1000, 3, 0)
  ) as 'Numero',
  IF(e.gmp, 'GMP', '') as 'GMP',
  db_EquiposeInfraestructura_V1.getClase(e.id DIV 1000) as 'Clase',
  e.Objeto as 'Objeto',
  db_EquiposeInfraestructura_V1.getModulo(e.id MOD 1000) as 'Modulo',
  e.Elemento as 'Elemento',
  e.Caracteristicas as 'Caracteristicas',
  cal.detalle as 'Calibracion',
  concat(
    u.area,
    ' ',
    lpad(u.code, 2, 0),
    u.ambiente,
    u.pisonivel
  ) as 'Ubicacion'
FROM
  db_EquiposeInfraestructura_V1.CodificacionEquipos e
  left JOIN db_EquiposeInfraestructura_V1.Instalaciones i on i.id = e.id
  left JOIN db_EquiposeInfraestructura_V1.CodificacionInfraestructura u on u.code = i.code
  AND u.area = i.area
  left JOIN db_EquiposeInfraestructura_V1.Area a on a.codigo = u.area
  INNER JOIN db_EquiposeInfraestructura_V1.TipodeCalibracion cal on cal.id = e.calibracion #left JOIN db_EquiposeInfraestructura_V1.CodificacionInfraestructura inf on inf.code = i.ubicacion
WHERE
  e.eliminado = false;
SELECT
  *
FROM
  db_EquiposeInfraestructura_V1.Equipos;
SELECT
  *
FROM
  db_EquiposeInfraestructura_V1.Equipos;
SELECT
  *
FROM
  db_EquiposeInfraestructura_V1.CodificacionEquipos;
SELECT
  84000 MOD 1000;
SELECT
  concat(
    lpad(84000 DIV 1000, 3, 0),
    ' ',
    lpad(84000 MOD 1000, 3, 0)
  );
DROP PROCEDURE IF EXISTS db_EquiposeInfraestructura_V1.getDataEquipo;
DELIMITER $;
CREATE PROCEDURE db_EquiposeInfraestructura_V1.getDataEquipo(_id INTEGER UNSIGNED) BEGIN
SELECT
  e.id as 'id',
  e.gmp as 'gmp',
  #CASE WHEN e.gmp = 1 THEN 'true' ELSE 'false'  END AS 'gmp',
  e.objeto as 'objeto',
  e.elemento as 'elemento',
  e.caracteristicas as 'caracteristicas',
  e.tipo as 'tipo',
  e.calibracion as 'calibracion',
  ifnull(i.ubicacion, 0) as 'ubicacion'
FROM
  db_EquiposeInfraestructura_V1.CodificacionEquipos e
  left JOIN db_EquiposeInfraestructura_V1.Instalaciones i on i.id = e.id
WHERE
  e.id = _id
  AND e.eliminado = false;
 END $;
call db_EquiposeInfraestructura_V1.getDataEquipo(84000);