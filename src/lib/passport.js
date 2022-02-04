import request from "request";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import pool from "../database.js";
/*import * as helpers from "./helpers.js";*/
import * as crypto from "./crypto.js";
import config from "../config.js";
const { captcha } = config;

// Passport para el inicio de session
passport.use(
    'local.signin',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        async function (req, email, password, done) {
            //console.log(req.body);
            let users = await pool.query('SELECT * FROM db_UsuariosySesiones.usuarios');
            //let index_user = users.findIndex(x => x.email === email || x.email.match(/^[a-zA-Z0-9]{3,20}/g)[0] === email);
            let index_user = users.findIndex(x => x.email === email);
            console.log(index_user);
            if (index_user !== -1) {
                const user = users[index_user];
                const match = await crypto.matchPassword(password, user.password);
                if (match) {
                    console.log("Success Login.");
                    return done(null, user, req.flash('success', 'Bienvenido ' + user.username));
                } else {
                    console.log('Incorrect Password');
                    return done(null, false, req.flash('message', 'Tu correo electrónico o contraseña es incorrecta. Inténtalo nuevamente.'));
                }
            } else {
                console.log("User don't exists.");           
                return done(
                    null,
                    false,
                    //req.flash('message', 'Tu correo electrónico o contraseña es incorrecta. Inténtalo nuevamente.')
                    req.flash('message', 'Tu correo electrónico no existe o es incorrecto. Inténtalo nuevamente.')
                );
            }
        }
    )
);

passport.use(
    'local.signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            //passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {

            const { fullname } = req.body;
            let newUser = {
                fullname,
                username,
                password
            };
            /*
            newUser.password = await crypto.encryptPassword(password);
            // Saving in the Database
            const result = await pool.query('INSERT INTO users SET ? ', newUser);
            newUser.id = result.insertId;
            */
            return done(null, newUser);

        }
    )
);

passport.serializeUser(
    function (user, done) {
        done(null, user.id);
    }
);

passport.deserializeUser(
    async function (id, done) {
        let users = await pool.query('SELECT * FROM db_UsuariosySesiones.usuarios');
        let index_user = users.findIndex(x => x.id === id);
        done(null, users[index_user]);
        //clear sessions
        //return done(null, true);
    }
);