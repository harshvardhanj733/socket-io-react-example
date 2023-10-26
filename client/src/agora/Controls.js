import { useState } from "react";
import { useClient } from "./Settings";
// import { Grid, Button } from "@material-ui/core";
// import MicIcon from "@material-ui/icons/Mic";
// import MicOffIcon from "@material-ui/icons/MicOff";
// import VideocamIcon from "@material-ui/icons/Videocam";
// import VideocamOffIcon from "@material-ui/icons/VideocamOff";
// import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {
  FaMicrophoneAlt,
  FaMicrophoneAltSlash,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

export default function Controls(props) {
  const client = useClient();
  const { tracks, setStart, setInCall } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  return (
    <div className="flex justify-between w-50vw px-12 pt-4 text-3xl text-white ">
      <button
        className=" hover:text-gray-200"
        // className={`bg-{trackState.audio ? "blue" : "red"}-400`}
        onClick={() => mute("audio")}
      >
        {trackState.audio ? <FaMicrophoneAlt /> : <FaMicrophoneAltSlash />}
      </button>
      {/* bg-{trackState.audio ? "blue" : "red"}-400 */}
      <button className=" hover:text-gray-200" onClick={() => mute("video")}>
        {trackState.video ? <FaVideo /> : <FaVideoSlash />}
      </button>
      <div>
        <button onClick={() => leaveChannel()} className="hover:text-red-400">
          <FaPhoneSlash />
        </button>
      </div>
    </div>
  );
}
