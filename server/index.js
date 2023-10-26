const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let participantList = [];

io.on("connection", (socket) => {
  socket.emit("getId", socket.id);
  socket.on("join_room", ({ room, name }) => {
    // console.log(`${socket.id} joined room no. ${room}`);
    socket.join(room);
    socket.name = name;
    socket.room = room;
    socket.to(room).emit("newJoinee", {
      name,
      id: socket.id,
    });
    participantList.push({
      name,
      id: socket.id,
    });
    io.to(room).emit("participantList", participantList);
  });

  socket.on("wannaDisconnect", ({ room, name }) => {
    let tempArr = participantList;
    participantList = [];
    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].id !== socket.id) {
        participantList.push(tempArr[i]);
      }
    }
    let disconnectObj = {
      participantList,
      id: socket.id,
      name,
    };
    socket.leave(room);
    io.to(room).emit("disconnectJoinee", disconnectObj);
  });

  socket.on("disconnect", () => {
    // Handle disconnection similar to 'wannaDisconnect' logic
    let room = socket.room;
    let tempArr = participantList.filter(
      (participant) => participant.id !== socket.id
    );
    let disconnectObj = {
      participantList: tempArr,
      id: socket.id,
      name: socket.name, // Assuming you have stored the name in the socket object
    };

    // Broadcast the disconnection event to all clients in the room
    socket.leave(room);
    io.to(room).emit("disconnectJoinee", disconnectObj);

    // Update the participant list after disconnection
    participantList = tempArr;

    // Notify clients about the updated participant list after disconnection
    io.to(room).emit("participantList", participantList);
  });

  socket.on("send_message", (messageDetails) => {
    const { room, messageDeet } = messageDetails;
    socket.to(messageDetails.room).emit("receive_message", messageDetails);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
