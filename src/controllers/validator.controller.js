import { body, validationResult } from "express-validator";
import request from "request";
import config from "../config.js";
const { captcha } = config;

const validatorCtrl = {};

validatorCtrl.validator = function (method) {
    switch (method) {
        case 'createUser': {
            return [
                body('userName', 'El usuario no existe').exists(),
                body('email', 'Invalid email').exists().isEmail(),
                body('phone').optional().isInt(),
                body('status').optional().isIn(['enabled', 'disabled'])
            ]
        }
        case 'accessRequests': {
            return [
                body('email', 'Invalid email').exists().isEmail()
            ]
        }
        case 'loginUser': {
            return [
                body('email', 'Invalid email').exists().isEmail(),
                body('password', 'Invalid password').exists()
            ]
        }
    }
}

validatorCtrl.reCaptcha = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    if (!req.body.captcha) {
        res.json({ "message": "No se reconoce el captcha." });
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${captcha.private}&response=${req.body.captcha}`;

    request(verifyUrl, function (error, response, body) {
        if (error) {
            console.log(error);
            req.flash("error", "Error de conexion, vuela intentarlo mas tarde.");
            return res.redirect('/');
        }
        body = JSON.parse(body);
        if (!body.success || body.score < 0.4) {
            req.flash("error", "Eres un Robot, has sido baneado.");
            return res.redirect('/');
        }
        //console.log("reCaptcha");
        //console.log(body);
        //res.json({ "message": "Captcha Ok", 'score': body.score , 'success':''});      
        next();
    });

}
export default validatorCtrl;
