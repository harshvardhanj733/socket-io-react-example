import "./App.css";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Messaging from "./components/Messaging";
import Canvas from "./components/Canvas";

const socket = io.connect("http://localhost:3001");

function App() {
  //All Users State In a Room
  const [participants, setParticipants] = useState([]);

  //Name State
  const [name, setName] = useState("");
  // Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Messenger State
  const [myId, setMyId] = useState("");
  const middleMessageContainerRef = useRef();

  const joinRoom = () => {
    if (room !== "" && name != "") {
      socket.emit("join_room", { room, name });
      alert(
        `Your Name is: ${name} ~ ${myId.substring(
          0,
          3
        )} and You have joined room ${room}`
      );
    }
  };

  const handleDeletion = () => {
    console.log("Delete Button Clicked");
    socket.emit("wannaDisconnect", { room, name });
    window.location.reload();
  };

  const sendMessage = () => {
    const date = new Date();
    const currentTime = date.getTime();
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    // Pad single-digit hours and minutes with leading zeros
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedTime = `${formattedHours}:${formattedMinutes}`;

    console.log(formattedTime);

    let messageDeet = {
      message,
      // messengerId: myId,
      name: `${name} ~ ${myId.substring(0, 3)}`,
      messageTime: formattedTime,
      sent: true, //You can change this... and line number 59
    };
    setMessages((existingMessages) => {
      const updatedMessages = [...existingMessages, messageDeet];
      return updatedMessages;
    });

    const sendMessage = {
      messageDeet,
      room,
    };

    socket.emit("send_message", sendMessage);

    setMessage("");
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Call handleDeletion when the page is about to unload (reload, close, etc.)
      handleDeletion();
    };

    // Attach the event listener to the beforeunload event
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    socket.on("getId", (id) => {
      setMyId(id);
    });
  }, []);

  useEffect(() => {
    socket.on("receive_message", (messageDetails) => {
      messageDetails.messageDeet.sent = false; //You can change this and line number 33
      setMessages((existingMessages) => {
        const updatedMessages = [
          ...existingMessages,
          messageDetails.messageDeet,
        ];
        return updatedMessages;
      });
    });

    socket.on("newJoinee", ({ name, id }) => {
      alert(`New User Joined: ${name} ~ ${id.substring(0, 3)}`);
    });

    socket.on("participantList", (participantList) => {
      setParticipants(participantList);
    });

    socket.on("disconnectJoinee", (disconnectObj) => {
      alert(
        `User Disconnected: ${
          disconnectObj.name
        } ~ ${disconnectObj.id.substring(0, 3)}`
      );
      setParticipants(disconnectObj.participantList);
    });
  }, [socket]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const container = middleMessageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };
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
    <div className="flex w-screen flex-col md:flex-row">
      <Messaging
        participants={participants}
        // name={name}
        // room={room}
        // message={message}
        messages={messages}
        // myId={myId}
        joinRoom={joinRoom}
        handleDeletion={handleDeletion}
        sendMessage={sendMessage}
        // scrollToBottom={scrollToBottom}
        handleEnter={handleEnter}
        handleEnterRoom={handleEnterRoom}
        setName={setName}
        setRoom={setRoom}
        setMessage={setMessage}
        middleMessageContainerRef={middleMessageContainerRef}
      />{" "}
      <div className="h-screen w-full md:w-2/3 bg-rose-100">
        {" "}
        <Canvas />
        <div className="h-1/2 bg-teal-200"> Video Grids</div>
      </div>
    </div>
  );
}

export default App;
