import { Router } from "express";
const router = Router();

import { isLoggedIn, isNotLoggedIn } from '../lib/authentication.js';
import home  from "../controllers/home.controller.js";

router.get("/",isNotLoggedIn ,home.renderHome);

export default router;