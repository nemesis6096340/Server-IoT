import { Router } from "express";
const router = Router();

import link  from "../controllers/capture.js";

//router.get("/enlaceFBUS", link.fbus);
router.get("/loadFBUS", link.load);
router.get("/configFBUS", link.config);

export default router;
