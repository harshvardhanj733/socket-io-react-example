import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  // Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Messenger State
  const [myId, setMyId] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      alert(`Your Id is: ${myId} and You have joined room ${room}`);
    }
  };

  const sendMessage = () => {
    const date = new Date();
    const currentTime = date.getTime();

    let messageDeet = {
      message,
      messengerId: myId,
      messageTime: currentTime,
      color: "red"                  //You can change this... and line number 59
    };
    setMessages((existingMessages) => {
      const updatedMessages = [...existingMessages, messageDeet];
      return updatedMessages;
    });

    const sendMessage = {
      messageDeet,
      room
    }

    socket.emit("send_message", sendMessage);

    setMessage('');

  };

  useEffect(() => {
    socket.on("getId", (id) => {
      setMyId(id);
    });
  }, []);

  useEffect(() => {
    socket.on("receive_message", (messageDetails) => {
      messageDetails.messageDeet.color = "black";         //You can change this and line number 33
      setMessages((existingMessages) => {
        const updatedMessages = [...existingMessages, messageDetails.messageDeet];
        return updatedMessages;
      });
    });

    socket.on("newJoinee", (id) => {
      alert(`New User Joined: ${id}`);
    });
  }, []);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  const handleEnterRoom = (e) => {
    if (e.key === "Enter") {
      joinRoom(e);
    }
  };

  return (
    <div className="flex flex-col justify-start p-4 w-full items-center">
      <div>
        <input
          placeholder="Room Number..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
          onKeyDown={handleEnterRoom}
        />
        <button className="bg-red-100 px-3 rounded-md py-1" onClick={joinRoom}>
          Join Room
        </button>
      </div>
      <div className="flex flex-col justify-around w-screen mt-4 bg-cyan-100">
        {messages.map((messageDeet) => (
          <div>
            <h2 style={{ color: `${messageDeet.color}` }} className="font-bold">{messageDeet.message}</h2>
            <p style={{ color: `${messageDeet.color}` }}>{messageDeet.messengerId}</p>
            <p style={{ color: `${messageDeet.color}` }}>{messageDeet.messageTime}</p>
          </div>
        ))}
      </div>
      <div className="w-screen px-12 border border-t-red-800 py-4 flex justify-between">
        <input
          className="w-full mr-4 border-none outline-none"
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          onKeyDown={handleEnter}
        />
        <button
          className="bg-yellow-100 pl-8 w-32 rounded-md py-3 flex"
          onClick={sendMessage}
        >
          Send 📩
        </button>
      </div>
    </div>
  );
}

export default App;

