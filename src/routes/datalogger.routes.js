import { Router } from "express";
const router = Router();
import { isLoggedIn } from '../lib/authentication.js';

import datalogger  from "../controllers/datalogger/datalogger.controller.js";

router.get("/termohigrometria",isLoggedIn, datalogger.list);
router.get("/termohigrometria/sensor",isLoggedIn, datalogger.sensor);

export default router;
