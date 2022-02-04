import { Router } from "express";
import { isLoggedIn, isNotLoggedIn } from '../lib/authentication.js';
import admin from "../controllers/admin.controller.js";
import equipment from "../controllers/facilities/equipment.controller.js";
import infrastructure from "../controllers/facilities/infrastructure.controller.js";

import devices from "../controllers/devices/index.js";
import users from "../controllers/users/index.js";

const router = Router();

router.get('/administrar', isLoggedIn, admin.renderIndex);

//router.get("/enlaceFBUS", link.fbus);
router.get("/administrar/instalaciones", isLoggedIn, admin.renderFacilities);

router.get("/administrar/dispositivos", isLoggedIn, devices.list);

router.get("/administrar/instalaciones/equipos", isLoggedIn, equipment.list);
router.get("/administrar/instalaciones/equipos/agregar", isLoggedIn, equipment.add);
router.get("/administrar/instalaciones/equipos/editar", isLoggedIn, equipment.edit);
router.post("/administrar/instalaciones/equipos/modificar", isLoggedIn, equipment.update);
router.post("/administrar/instalaciones/equipos/guardar", isLoggedIn, equipment.save);
router.post("/administrar/instalaciones/equipos/eliminar", isLoggedIn, equipment.delete);

router.get("/administrar/instalaciones/infraestructuras", isLoggedIn, infrastructure.list);

router.get("/administrar/instalaciones/infraestructuras/plantas", isLoggedIn, infrastructure.plant);
router.get("/administrar/instalaciones/infraestructuras/plantas/areas", isLoggedIn, infrastructure.area);
router.get("/administrar/instalaciones/infraestructuras/plantas/areas/ubicaciones", isLoggedIn, infrastructure.location);

router.get("/administrar/instalaciones/infraestructuras/agregar", isLoggedIn, infrastructure.add);
router.get("/administrar/instalaciones/infraestructuras/editar", isLoggedIn, infrastructure.edit);
router.post("/administrar/instalaciones/infraestructuras/modificar", isLoggedIn, infrastructure.update);
router.post("/administrar/instalaciones/infraestructuras/guardar", isLoggedIn, infrastructure.save);
router.post("/administrar/instalaciones/infraestructuras/eliminar", isLoggedIn, infrastructure.delete);

router.get("/administrar/usuarios", isLoggedIn, users.list);

export default router;