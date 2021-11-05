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
//-> END socket.io

//app.listen(app.get("port"));
console.log("Server on port", app.get("port"));