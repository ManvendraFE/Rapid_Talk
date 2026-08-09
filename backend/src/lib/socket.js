import {Server} from "socket.io";
import http from "http";
import express from "express";
import {ENV} from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express()
const server = http.createServer(app)
const io = new Server(server, 
  {
    cors: {
      origin: [ENV.CLIENT_URL],
      credentials:true,
    },
  }
); 

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware)


const userSocketMap = {}; // {useerId:socketId} It is an object where we store the userId and socketId of the connected users. So that we can know which user is online and which user is offline.

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);
  
  const userID = socket.user._id.toString()
  userSocketMap[userID] = socket.id // if someone connect to the socket server then we will store his userId and socketId in the userSocketMap object. So that we can know which user is online and which user is offline.

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //io.emit() is used to send a message to all connected clients. Here we are sending the list of online users to all connected clients. Object.keys(userSocketMap) will return an array of userIds of the online users.


  socket.on("disconnect", ()=>{
    console.log("A user disconnected",  socket.user.fullName);
    delete userSocketMap[userID]; // if someone disconnect from the socket server then we will delete his userId and socketId from the userSocketMap object. So that we can know which user is online and which user is offline.
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
});

export {io, app, server};