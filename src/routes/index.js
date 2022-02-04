import { Router } from "express";

import home from "./home.routes.js";
import authentication from "./authentication.routes.js";

import dashboard from "./dashboard.routes.js";
import facilities from "./facilities.routes.js";
import production from "./production.routes.js";
import admin from "./admin.routes.js";
import capture from "./capture.routes.js";
import datalogger from "./datalogger.routes.js";

const router = Router();
router.use(home);
router.use(dashboard);
router.use(authentication);
router.use(facilities);
router.use(production);
router.use(admin);
router.use(capture);
router.use(datalogger);

export default router;
