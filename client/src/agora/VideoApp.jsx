import { useState } from "react";
import VideoCall from "./VideoCall";

function VideoApp() {
  const [inCall, setInCall] = useState(false);

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      // className="flex justify-center items-center"
    >
      {inCall ? (
        <VideoCall setInCall={setInCall} />
      ) : (
        <div className="w-full h-full ">
          {" "}
          <button
            onClick={() => setInCall(true)}
            className="px-16 my-20 w-max mx-52 py-8 rounded-lg border-4 border-white text-6xl text-white hover:bg-white hover:text-purple-500"
          >
            Join Video
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoApp;
