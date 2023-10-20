import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

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

  const joinRoom = () => {
    if (room !== "" && name != "") {
      socket.emit("join_room", { room, name });
      alert(`Your Name is: ${name} ~ ${myId.substring(0, 3)} and You have joined room ${room}`);
    }
  };

  const handleDeletion = () => {
    console.log("Delete Button Clicked")
    socket.emit('wannaDisconnect', { room, name })
    window.location.reload();
  }

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

    socket.on('participantList', (participantList) => {
      setParticipants(participantList);
    })

    socket.on('disconnectJoinee', (disconnectObj) => {
      alert(`User Disconnected: ${disconnectObj.name} ~ ${disconnectObj.id.substring(0, 3)}`);
      setParticipants(disconnectObj.participantList);
    })
  }, [socket]);

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
    <div className="flex w-screen">
      <div className="flex flex-col overflow-x-hidden justify-start w-screen lg:w-1/3 items-center h-screen">
        <div
          id="HeadRoomElement"
          className="flex justify-between w-full gap-0 items-center h-[10vh] bg-blue-800"
        >
          {" "}
          <p className="font-bold text-white text-xl">pH</p>
          <div className="space-x-4">
            {" "}
            <input
              className="p-2 outline-none w-28"
              placeholder="Your name"
              onChange={(event) => {
                setName(event.target.value);
              }}
              onKeyDown={handleEnterRoom}
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
            // onClick={() => {
            //   window.location.reload();
            // }}

            onClick={handleDeletion}
          >
            {" "}
            ❌
          </button>
        </div>

        <div className="w-full overflow-x-scroll bg-blue-500 h-[8vh] text-white flex">
          {participants.map((participant) => {
            return (
              <p>
                {participant.name}~{participant.id.substring(0, 3)}&nbsp;
              </p>
            );
          })}
        </div>

        <div
          className={`flex flex-col text-gray-500 justify-start w-full h-[67vh] overflow-y-scroll bg-cyan-50`}
        >
          {" "}
          {/* {participants.map((participant)=>(
          <p>{participant.name}   {participant.id}</p>
        ))} */}
          {messages.map((messageDeet) => (
            <div className="flex flex-col px-2 pt-2 gap-3">
              <div
                className={` flex flex-col ${
                  messageDeet.sent ? "items-end" : "items-start"
                }`}
              >
                {" "}
                <p className={`${messageDeet.sent ? "hidden" : "inline"}`}>
                  {/* {messageDeet.messengerId} */}
                  {messageDeet.name}
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
          className="w-full px-8 border-y-blue-900 border-4  bg-white border-blue-100 py-4 flex justify-between h-[15vh]"
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
            className="bg-yellow-100 hover:bg-yellow-400 pl-2 w-24 rounded-md py-3 flex"
            onClick={sendMessage}
          >
            {" "}
            Send 📩
          </button>
        </div>
      </div>
      <div className="h-screen flax flax-cols w-2/3 bg-rose-100">
        <div className="h-1/2 bg-red-200"> Drawing Space</div>
        <div className="h-1/2 bg-teal-200"> Video Grids</div>
      </div>
    </div>
  );
}

export default App;
