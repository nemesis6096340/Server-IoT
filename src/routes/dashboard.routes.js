import { Router } from "express";
const router = Router();

import { isLoggedIn } from '../lib/authentication.js';
import dashboard  from "../controllers/dashboard.controller.js";

router.get("/dashboard",isLoggedIn ,dashboard.monit);

export default router;