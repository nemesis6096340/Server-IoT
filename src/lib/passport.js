import request from "request";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import pool from "../database.js";
import * as helpers from "./helpers.js";

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
            console.log("PASSPORT");
            console.log(req.body);                  
            let users = await pool.query('SELECT * FROM db_UsuariosySesiones.usuarios');

            let index_user = users.findIndex(x => x.email === email);
            console.log(index_user);
            if (index_user !== -1) {
                const user = users[index_user];
                const match = await helpers.matchPassword(password, user.password)
                if (match) {
                    console.log("Success Login.");
                    done(null, user, req.flash('success', 'Welcome ' + user.username));
                } else {
                    console.log('Incorrect Password');
                    done(null, false, req.flash('message', 'Incorrect Password'));
                }
            } else {
                console.log('The Username does not exists.');
                done(
                    null,
                    false,
                    req.flash('message', 'The Username does not exists.')
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
            newUser.password = await helpers.encryptPassword(password);
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
    }
);