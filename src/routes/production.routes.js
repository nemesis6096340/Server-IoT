import { Router } from "express";
const router = Router();

import control  from "../controllers/production/control.js";

router.get("/produccion/", control.list);
router.post('/produccion/enlace',control.logger);

export default router;