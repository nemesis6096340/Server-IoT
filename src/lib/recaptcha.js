import request from "request";
import config from "../config.js";
const { captcha } = config;

export const reCaptcha = function (req, res, next) {
    console.log(req.body);
    if (!req.body.captcha) {
        res.json({ "message": "No se reconoce el captcha." });
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${captcha.private}&response=${req.body.captcha}`;

    request(verifyUrl, function (error, response, body) {
        if (error) {
            console.log(error);
            req.flash("error", "Error de conexión, vuelva intentarlo más tarde.");
            return res.redirect('/');
        }
        body = JSON.parse(body);
        if (!body.success || body.score < 0.4) {
            req.flash("error", "Tiempo agotado para la conexión.");
            return res.redirect('/');
        }
        //console.log("reCaptcha");
        //console.log(body);
        //res.json({ "message": "Captcha Ok", 'score': body.score , 'success':''});      
        next();
    });
}