import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

import control  from "./controllers/production/control.js";

// -> Path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/produccion/enlace', control.logger);

// Settings
app.set('port', 3002);

app.listen(app.get("port"), function () {
    console.log("Server on port", app.get("port"));
});
