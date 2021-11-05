import request from "request";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import pool from "../database.js";
import * as helpers from "./helpers.js";

/*
//V3
const public_key = '6LcisxQdAAAAACQbCj13NdP51JGstBahCoQ3n9Cb';
const secret_key = '6LcisxQdAAAAABx15fNkpAaW5kONj2U0xtr8mBqz';
*/
const public_key = '6LdW0xQdAAAAAHoRzkbq_qLY0t1gp6YNi0RdnNeC';
const secret_key = '6LdW0xQdAAAAAKgYVsRFhzVlJKrw8fXLhgGIHIfG';

// Passport para el inicio de session
passport.use(
    'local.signin',
    new LocalStrategy(
        {
            // Los nombres de los campos del formulario
            usernameField: 'email',
            passwordField: 'password',
            // 
            passReqToCallback: true
        },

        async function (req, email, password, done) {
            /*let newUser = {
                id : 2641,
                email :'hacarapi@cofar.com.bo',                
                password,
                username:'Huber Acarapi Mamani',
                role:'Administrador'
            };
            newUser.password = await helpers.encryptPassword('cofar.2021');
            console.log(newUser);
            const result = await pool.query('INSERT INTO db_UsuariosySesiones.users SET ? ', newUser);
            newUser.id = result.insertId;
            console.log(newUser);
*/
            console.log(req.body);
            if (
                req.body.captcha === undefined ||
                req.body.captcha === '' ||
                req.body.captcha === null
            ) {
                console.log("error captcha");
            }
            //Verfy URL
            const verify_url = `https://google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
            request(verify_url, function(error, response, body){
                body = JSON.parse(body);

                // If not successful
                if(body.success != undefined && !body.success){
                    console.log("Fail captcha Verification");
                }

                // If successful                
            });
            
            // Make Requesr Ri Verify URL

            let users = await pool.query('SELECT * FROM db_UsuariosySesiones.usuarios');
            console.log(users);
            if (users.length > 0) {
                let index_user = users.findIndex(x => x.email === email);
                if (index_user !== -1) {
                    const user = users[index_user];
                    const validPassword = await helpers.matchPassword(password, user.password)
                    if (validPassword) {
                        done(null, user, req.flash('success', 'Welcome ' + user.username));
                    } else {
                        done(null, false, req.flash('message', 'Incorrect Password'));
                    }
                } else {
                    done(null, false, req.flash('message', 'The Username does not exists.'));
                }
            } else {
                return done(null, false, req.flash('message', 'The Username does not exists.'));
            }
        }
    )
);

passport.use(
    'local.signup',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
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
//console.log(id.id);

  //      const rows = await pool.query('SELECT * FROM db_UsuariosySesiones.usuarios WHERE id = ?', 2641);
    //    done(null, rows[0]);
    }
);