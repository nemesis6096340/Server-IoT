import { Router } from "express";
const router = Router();

import home  from "../controllers/home.controller.js";

router.get("/", function(req,res){
    res.redirect('/login');
});

router.get("/home", home.renderHome);

export default router;