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

let participantList = [];

io.on("connection", (socket) => {
  socket.emit('getId', socket.id);
  socket.on("join_room", ({room, name}) => {
    // console.log(`${socket.id} joined room no. ${room}`);
    socket.join(room);
    socket.to(room).emit('newJoinee', {
      name,
      id: socket.id
    })
    participantList.push({
      name,
      id: socket.id
    })
    io.to(room).emit('participantList', participantList);
  });

  socket.on('wannaDisconnect', ({room, name})=>{
      let tempArr = participantList
      participantList = [];
      for(let i = 0; i < tempArr.length; i++){
        if(tempArr[i].id !== socket.id){
          participantList.push(tempArr[i]);
        }
      }
      let disconnectObj = {
        participantList,
        id: socket.id,
        name
      }
      socket.disconnect();
      io.to(room).emit('disconnectJoinee', disconnectObj)
  })

  socket.on("send_message", (messageDetails) => {
    const {room, messageDeet} = messageDetails
    // console.log(messageDetails)
    socket.to(messageDetails.room).emit("receive_message", messageDetails);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
