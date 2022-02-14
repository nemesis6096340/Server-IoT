import { Router } from "express";
import { isLoggedIn } from '../lib/authentication.js';
const router = Router();

import control  from "../controllers/production/control.js";

router.get('/produccion/lote',isLoggedIn, control.data_lote);
router.get('/produccion/contador',isLoggedIn, control.data_counter);
router.get('/produccion/',isLoggedIn, control.list);

router.post('/produccion/enlace', control.logger);

export default router;