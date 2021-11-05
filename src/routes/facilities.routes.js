import { Router } from "express";
const router = Router();

import equipment  from "../controllers/facilities/equipment.controller.js";
import infrastructure  from "../controllers/facilities/infrastructure.controller.js";

//router.get("/enlaceFBUS", link.fbus);
router.get("/instalaciones/equipos", equipment.list);
router.get("/instalaciones/equipos/agregar", equipment.add);
router.get("/instalaciones/equipos/editar", equipment.edit);
router.post("/instalaciones/equipos/modificar", equipment.update);
router.post("/instalaciones/equipos/guardar", equipment.save);
router.post("/instalaciones/equipos/eliminar", equipment.delete);

router.get("/instalaciones/infraestructuras", infrastructure.list);
router.get("/instalaciones/infraestructuras/plantas", infrastructure.plant);
router.get("/instalaciones/infraestructuras/plantas/areas", infrastructure.area);
router.get("/instalaciones/infraestructuras/plantas/areas/ubicaciones", infrastructure.location);
router.get("/instalaciones/infraestructuras/agregar", infrastructure.add);
router.get("/instalaciones/infraestructuras/editar", infrastructure.edit);
router.post("/instalaciones/infraestructuras/modificar", infrastructure.update);
router.post("/instalaciones/infraestructuras/guardar", infrastructure.save);
router.post("/instalaciones/infraestructuras/eliminar", infrastructure.delete);

export default router;
