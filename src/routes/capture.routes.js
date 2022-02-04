import { Router } from "express";
const router = Router();
import { isLoggedIn } from '../lib/authentication.js';

//import link  from "../controllers/capture.js";
//import capture  from "../controllers/capture/capture.controller.js";
import capture  from "../controllers/capture/capture.controller.js";
//router.get("/enlaceFBUS", link.fbus);
//router.get("/loadFBUS", link.load);
//router.get("/configFBUS", link.config);
router.get("/capturas",isLoggedIn, capture.list);
router.post("/capture/enlace",capture.logger);
export default router;
