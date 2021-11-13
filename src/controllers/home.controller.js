import config from "../config.js";
const { captcha } = config;

const homeCtrl = {};

homeCtrl.renderHome = function(req, res) {
    //console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    //console.log(req.useragent);
    res.render('home.hbs',{layout:false, public_key: captcha.public});
};

export default homeCtrl;