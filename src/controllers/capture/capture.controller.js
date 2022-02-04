import app from "../../app.js";
import * as helpers from "../../lib/helpers.js";
import moment from 'moment';

const captureCtrl = {};

const navigate = { capture: true };

var captures = JSON.parse(`[
    {"id":"PES-658","net":2017.92,"tare":0,"gross":2017.92,"unit":"g","time":1641405965},
    {"id":"PES-557","net":0,"tare":0,"gross":0,"unit":"g","time":1641427351},
    {"id":"PES-506","net":29.21,"tare":0,"gross":29.21,"unit":"g","time":1638323846},
    {"id":"PES-565","net":10,"tare":0,"gross":0,"unit":"g","time":1636378374}    
]`);

captureCtrl.list = function (req, res) {
    res.render('capture/index.hbs', { navigate });
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

    res.send("OK");
};
export default captureCtrl;