import { Router } from "express";
const router = Router();

import link  from "../controllers/link.js";

//router.get("/enlaceFBUS", link.fbus);
router.get("/loadFBUS", link.load);
router.get("/configFBUS", link.config);

export default router;
