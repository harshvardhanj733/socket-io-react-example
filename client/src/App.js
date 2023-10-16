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
  const [messengerId, setMessengerId] = useState('');

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
    setMessages(existingMessages => {
      const updatedMessages = [...existingMessages, message];
      console.log(updatedMessages); // Add this line for debugging
      return updatedMessages;
    });
  };

  useEffect(() => {
    socket.on("receive_message", (messageDetails) => {
      setMessageReceived(existingMessages => {
        const updatedMessages = [...existingMessages, messageDetails.message];
        console.log(updatedMessages); // Add this line for debugging
        return updatedMessages;
      });
      setMessengerId(messageDetails.user);
    });

    socket.on("newJoinee", (id)=>{
      alert(`New User Joined: ${id}`)
    })

  }, [socket]);
  

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messages.map((message) => {
        return(<>
          <h2 style={{color:"red"}}>{message}</h2>
          <br />
        </>)
      })}
      {messageReceived.map((message) => {
        return(<>
          <h2>{message}</h2>
          <br />
        </>)
      })}
      {/* <h2>{messageReceived}</h2> */}
      <p>{messengerId}</p>
    </div>
  );
}

export default App;
