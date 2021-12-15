import { Router } from "express";

import home from "./home.routes.js";
import authentication from "./authentication.routes.js";

import dashboard from "./dashboard.routes.js";
import facilities from "./facilities.routes.js";
import production from "./production.routes.js";
import admin from "./admin.routes.js";

const router = Router();
router.use(home);
router.use(dashboard);
router.use(authentication);
router.use(facilities);
router.use(production);
router.use(admin);

export default router;
