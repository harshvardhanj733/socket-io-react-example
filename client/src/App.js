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
      messengerId: myId,
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
  const [elementHeight, setElementHeight] = useState(0);
  useEffect(() => {
    const windowHeight = window.innerHeight;
    const headerHeight =
      document.getElementById("HeadRoomElement").offsetHeight;
    const footerHeight =
      document.getElementById("FooterSendElement").offsetHeight;
    const calculatedHeight = windowHeight - headerHeight - footerHeight;

    setElementHeight(calculatedHeight);

    console.log(elementHeight);
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden bg-blue-800 justify-start pt-4 w-full items-center">
      <div
        id="HeadRoomElement"
        className="flex justify-between px-16 w-full gap-7 items-center"
      >
        {" "}
        <p className="font-bold text-white text-xl">pH</p>
        <div className="space-x-4">
          {" "}
          <input
            className="p-2 outline-none w-28 hidden"
            placeholder="Your name"
            // onChange={(event) => {
            //   setRoom(event.target.value);
            // }}
            // onKeyDown={handleEnterRoom}
          />
          <input
            className="p-2 outline-none w-24"
            placeholder="Room No."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
            onKeyDown={handleEnterRoom}
          />
          <button
            className="bg-red-100 px-3 rounded-md py-2 hover:bg-red-500"
            onClick={joinRoom}
          >
            {" "}
            Join
          </button>
        </div>
        <button
          className="text-2xl rounded-md hover:bg-red-500 pb-2"
          onClick={() => {
            window.location.reload();
          }}
        >
          {" "}
          ❌
        </button>
      </div>
      <div
        className={`flex flex-col text-gray-500 justify-start w-screen h-[440px] overflow-y-scroll mt-4 bg-cyan-50`}
      >
        {" "}
        {messages.map((messageDeet) => (
          <div className="flex flex-col px-20 pt-2 gap-3">
            <div
              className={` flex flex-col ${
                messageDeet.sent ? "items-end" : "items-start"
              }`}
            >
              {" "}
              <p className={`${messageDeet.sent ? "hidden" : "inline"}`}>
                {messageDeet.messengerId}
              </p>
              <h2
                className={`font-bold ${
                  messageDeet.sent ? "text-red-800" : "text-blue-500"
                }`}
              >
                {messageDeet.message}
              </h2>
              <p>{messageDeet.messageTime}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        id="FooterSendElement"
        className="w-screen px-8 border-y-blue-900 border-4  bg-white border-blue-100 py-4 flex justify-between"
      >
        <input
          className="w-full px-3 border-none outline-none"
          placeholder="Message..."
          onChange={(a) => {
            setMessage(a.target.value);
          }}
          onKeyDown={handleEnter}
        />
        <button
          className="bg-yellow-100 hover:bg-yellow-400 pl-3 w-24 rounded-md py-3 flex"
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
