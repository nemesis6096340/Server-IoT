import express from "express";
import path from "path";
import mysql from "mysql";
import exphbs from "express-handlebars";
import myconnection from 'express-myconnection';

import config from "./config.js";
import routes from "./routes/index.js";

import { timeago, checklength } from "./lib/helpers.js"

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// -> Sesiones
import session from "express-session";
import flash from "connect-flash";
import expressMySqlSession from "express-mysql-session";
import passport from "passport";
import "./lib/passport.js";

// -> User - Agent
import useragent from 'express-useragent';

// -> Path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { db, dbs, port } = config;

const app = express();

// Settings

app.set('port', port);
app.set("views", path.join(__dirname, "views"));
app.engine(
    '.hbs',
    exphbs({
        defaultLayout: "main",
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
        extname: ".hbs",
        helpers: {
            json: function (context) {
                return JSON.stringify(context);
            },
            timeago,
            checklength
        },
    })
);
app.set('view engine', '.hbs');
// -> Los datos recibidos son convertimos en objetos de javascript
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middlewares
//app.use(morgan('dev'));

// -> Establecemos la conexion a la base de datos con los parametros db
app.use(myconnection(mysql, db, 'single'));



// -> Manejo de sesiones de usuario
const MySQLStore = expressMySqlSession(session);
const sessionStore = new MySQLStore(dbs);
app.use(
    session(
        {
            key: 'cockie_usuario',
            secret: 'sesion secreta',
            store: sessionStore,
            resave: true,
            saveUninitialized: false,
            cookie: {
            }
        }
    )
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

/*
app.get('/',function(req, res){
    req.session.user = 'hacarapi';
    req.session.rol = 'Administrador';
    req.session.visitas = req.session.visitas ? ++req.session.visitas : 1;
    res.render('login.hbs', {layout: false});
    
    res.send(`
        El usuario <strong> ${req.session.user} </strong> 
        con el <strong> ${req.session.rol} </strong> 
        ha visitado esta pagina <strong> ${req.session.visitas} </strong>
    `);
    
});*/

// Express session handling - Back button problem
// No almacenar la cache.
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// User-Agent
app.use(useragent.express());

// Variables Globales
app.use(function (req, res, next) {
    // varible message
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use(routes);

// Public
app.use(express.static(path.join(__dirname, "public")));

export default app;
