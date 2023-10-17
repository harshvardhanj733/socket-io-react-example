import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageReceived, setMessageReceived] = useState([]);
  
  //Messenger State
  const[myId, setMyId] = useState();
  const [messengerId, setMessengerId] = useState("");

  //Message Time
  const [messageTime, setMessageTime] = useState()

  //Message Details
  const [messageDeet, setMessageDeet] = useState({});

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    setMessengerId(myId);
    const currentTime = new Date().getTime();
    setMessageTime(currentTime);
    setMessageDeet({
      message,
      messengerId,
      messageTime
    })
    socket.emit("send_message", { messageDeet, room });
    setMessages((existingMessages) => {
      const updatedMessages = [...existingMessages, message];
      console.log(updatedMessages); // Add this line for debugging
      return updatedMessages;
    });
  };


  useEffect(() => {
    // Move the socket.on("getId") outside of the joinRoom function
    socket.on("getId", (id) => {
      console.log(id);
      setMyId(id);
      console.log(myId);
      alert(id);
    });
  }, []);

  useEffect(() => {

    socket.on("receive_message", (messageDetails) => {
      setMessageReceived((existingMessages) => {
        const updatedMessages = [...existingMessages, messageDetails.message];
        console.log(updatedMessages); // Add this line for debugging
        return updatedMessages;
      });
      setMessengerId(messageDetails.user);
    });

    socket.on("newJoinee", (id) => {
      alert(`New User Joined: ${id}`);
    });
  }, [socket]);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  const handleEnterRoom = (e) => {
    if(e.key === "Enter"){
        joinRoom(e);
    }
  }

  return (
    <div className="flex flex-col justify-start p-4 w-full items-center">
      <div>
        {" "}
        <input
          placeholder="Room Number..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
          onKeyDown={handleEnterRoom}
        />
        <button className="bg-red-100 px-3 rounded-md py-1" onClick={joinRoom}>
          {" "}
          Join Room
        </button>
      </div>
      <div className="flex flex-col justify-around w-screen mt-4 bg-cyan-100">
        {messages.map((message) => {
          return (
            <>
              <h2 className="ml-12" style={{ color: "red" }}>
                {message}
              </h2>
            </>
          );
        })}
        {messageReceived.map((message) => {
          return (
            <>
              <h2>{message}</h2>
            </>
          );
        })}
      </div>
      {/* <h2>{messageReceived}</h2> */}
      {/* <p>{messengerId}</p> */}
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
          {" "}
          Send 📩
        </button>
      </div>
    </div>
  );
}

export default App;
