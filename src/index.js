/**
 * Importing the Main App
 */
import app from "./app.js";

//-> [BEGIN] socket.io
import { Server as WebSocketServer } from "socket.io";
import http from "http";

const server = http.createServer(app);
const httpServer = server.listen(app.get("port"));
const io = new WebSocketServer(httpServer);
app.set('io', io);

io.on('connection', function (socket) {
    socket.removeAllListeners("connect");
    
    console.log('a user connected ' + socket.id);

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });    
});
//-> END socket.io

//app.listen(app.get("port"));
console.log("Server on port", app.get("port"));