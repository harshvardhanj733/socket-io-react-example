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
  socket.emit('getId', socket.id);
  socket.on("join_room", (room) => {
    // console.log(`${socket.id} joined room no. ${room}`);
    socket.join(room);
    socket.to(room).emit('newJoinee', socket.id)
  });

  socket.on("send_message", (messageDetails) => {
    const {room, messageDeet} = messageDetails
    // console.log(messageDetails)
    socket.to(messageDetails.room).emit("receive_message", messageDetails);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
