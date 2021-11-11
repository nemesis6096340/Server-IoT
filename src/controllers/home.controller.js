import config from "../config.js";
const { captcha } = config;

const homeCtrl = {};

homeCtrl.renderHome = function(req, res) {
    res.render('home.hbs',{layout:false, public_key: captcha.public});
};

export default homeCtrl;