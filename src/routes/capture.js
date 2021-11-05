const express = require('express');
const router = express.Router();

//const { renderIndex } = require("../controllers/index.controller");
const { renderHome } = require("../controllers/home.js");

console.log(renderHome);
router.get("/", function(req, res){
    res.send("Hello");
});

module.export = router;