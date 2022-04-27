import app from "../../app.js";
import * as helpers from "../../lib/helpers.js";
import moment from 'moment';
import Capture from "../../models/capture.js";
import fs from 'fs';

const captureCtrl = {};


const capture = new Capture();
const navigate = { capture: true };

var captures = JSON.parse(`[
    {"id":"PES-658","net":2017.92,"tare":0,"gross":2017.92,"unit":"g","time":1641405965},
    {"id":"PES-557","net":0,"tare":0,"gross":0,"unit":"g","time":1641427351},
    {"id":"PES-506","net":29.21,"tare":0,"gross":29.21,"unit":"g","time":1638323846},
    {"id":"PES-565","net":10,"tare":0,"gross":0,"unit":"g","time":1636378374},
    {"id":"PES-582","net":0,"tare":0,"gross":0,"unit":"kg","time":1638323846},
    {"id":"PES-650","net":0,"tare":0,"gross":0,"unit":"g","time":1636378374}
]`);

captureCtrl.list = async function (req, res) {
    let plants = await capture.list_capture_by_user_id(req.user.id);
    res.render('capture/index.hbs', { navigate, plants});
    const io = app.get('io');
    io.on('connection', function (socket) {
        console.log('a user connected ' + socket.id);
        //console.log(areas);
        captures.forEach(capture => {
            capture.datetime = moment(new Date(capture.time * 1000)).format('HH:mm:ss DD/MM/YYYY');;
            capture.timeago = helpers.timeago(capture.time * 1000);
        });
        
        socket.emit('server:captures', captures);
    });
    //app.get('io').emit('server:captures', captures);
};

captureCtrl.logger = function (req, res) {
    //console.log(req.body);
    let data = req.body;
    //console.log(data);
    captures.forEach(capture => {
        if (data.id === capture.id) {
            capture.net = data.net;
            capture.tare = data.tare;
            capture.gross = data.gross;
            capture.unit = data.unit;
            capture.time = data.time;
            capture.datetime = moment(new Date(capture.time * 1000)).format('HH:mm:ss DD/MM/YYYY');;
            capture.timeago = helpers.timeago(capture.time * 1000);
            app.get('io').emit('server:captures', captures);
        }
    });

    let current_time = Math.floor(new Date().getTime() / 1000.0);                
    let file_path = `./cache/FBUS/${data.id}`;
    if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path, { recursive: true });
    }
    let file_name = moment(new Date(current_time * 1000)).format('YYYYMMDD');
    fs.appendFile(`${file_path}/${file_name}.log`, `${moment(new Date(current_time * 1000)).format('YYYY-MM-DD hh:mm:ss ')} Net: ${data.net} Tare: ${data.tare} Gross:${data.gross} \n`, function (err) {
        if (err) return console.log(err);
    });
    res.send("OK");
};
export default captureCtrl;