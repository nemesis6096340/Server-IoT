import pool from "../database.js";
import passport from "passport";

import request from "request";
import config from "../config.js";
import { body } from "express-validator";
const { captcha } = config;


const authenticationCtrl = {};

authenticationCtrl.renderLogin = function (req, res, next) {
    let email = req.query.email;
    //console.log(req.session);
    if (email)
        res.render('login.hbs', { layout: false, email, public_key: captcha.public });
    else
        res.render('login.hbs', { layout: false, public_key: captcha.public });
}

authenticationCtrl.Login = passport.authenticate('local.signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
});

authenticationCtrl.Logout = function (req, res) {
    req.logOut();
    req.flash("success", "You are logged out now.");
    res.redirect('/login');
}

authenticationCtrl.Signin = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }



    /*
    const { email, password } = req.body;
    // req.session.my_variable = 'Hello World!';
    req.session.user_data = { email, password };
    req.flash('success', 'Now You are Registered')
    res.redirect('/profile');*/
};

authenticationCtrl.Signup = async function (req, res) {
    let {email} = req.body;
    let users = await pool.query('select * from db_UsuariosySesiones.usuarios;');
    let access_requests = await pool.query('select * from db_UsuariosySesiones.solicitudes;');

    if (access_requests.find(o => o.email === email)) {
        req.flash("message", "Solicitud pendiente de confirmacion.");
        return res.redirect('/');
    }
    if (!users.find(o => o.email === email)) {
        let new_access = {};
        new_access.email = email;
        new_access.time = Math.floor(Date.now() / 1000);
        new_access.data = data;
        console.log(new_access);
        let result = await pool.query("call db_UsuariosySesiones.agregarSolicitud(?,?,?)", [new_access.email, new_access.time, new_access.data]);
        if (result.affectedRows === 1) {
            console.log("Solicitud registrada");
            req.flash("message", "Su solicitud se ha registrado correctamente.");
            return res.redirect('/');
        }
        req.flash("error", "Ocurrió un error en su solicitud.");
        return res.redirect('/');
    }
    req.flash("message", "Verificación correcta, el usuario existe.");
    return res.redirect(`/login?email=${email}`);
}

authenticationCtrl.register = function (req, res) {
    const { email, password } = req.body;
    // req.session.my_variable = 'Hello World!';
    req.session.user_data = { email, password };
    req.flash('success', 'Now You are Registered')
    res.redirect('/profile');
};

authenticationCtrl.profile = function (req, res) {
    // console.log(req.session.my_variable);
    const user = req.session.user_data;
    delete req.session.user_data;

    res.render('profile', {
        user
    });
};

export default authenticationCtrl;