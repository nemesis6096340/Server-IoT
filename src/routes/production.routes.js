import { Router } from "express";
const router = Router();

import control  from "../controllers/production/control.js";

router.get('/produccion/lote',control.data_lote);
router.get('/produccion/contador',control.data_counter);
router.get('/produccion/', control.list);
router.post('/produccion/enlace',control.logger);

export default router;