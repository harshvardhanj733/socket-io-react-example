import React from "react";

function Messaging({
  participants,
  // name,
  // room,
  // message,
  messages,
  // myId,
  joinRoom,
  handleDeletion,
  sendMessage,
  // scrollToBottom,
  handleEnter,
  handleEnterRoom,
  setName,
  setRoom,
  setMessage,
  middleMessageContainerRef,
}) {
  // const middleMessageContainerRef = useRef();

  return (
    <>
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

        <div className="w-full overflow-x-auto bg-blue-500 h-[8vh] text-white flex">
          {participants.map((participant) => {
            return (
              <p>
                {participant.name}~{participant.id.substring(0, 3)}&nbsp;
              </p>
            );
          })}
        </div>

        <div
          ref={middleMessageContainerRef}
          id="MiddleMessageContainer"
          className={`flex flex-col text-gray-500 justify-start w-full h-[67vh] overflow-x-auto overflow-y-scroll bg-cyan-50`}
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
          className="w-full px-8 border-blue-900 border-4 items-center  bg-white py-4 flex justify-between h-[15vh]"
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
            className="bg-yellow-100 hover:bg-yellow-400 pl-2 w-24 h-12 py-2 rounded-md md:py-3 flex"
            onClick={sendMessage}
          >
            {" "}
            Send 📩
          </button>
        </div>
      </div>
    </>
  );
}

export default Messaging;
