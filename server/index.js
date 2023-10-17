const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  
  socket.on("join_room", (room) => {
    socket.emit('getId', socket.id);
    console.log(`${socket.id} joined room no. ${room}`);
    socket.join(room);
    socket.to(room).emit('newJoinee', socket.id)
  });

  socket.on("send_message", (messageDetails) => {
    const {room, message} = messageDetails
    console.log(messageDetails)
    const newMessageDetails = {
      room, 
      message,
      user: socket.id
    }
    socket.to(messageDetails.room).emit("receive_message", newMessageDetails);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
