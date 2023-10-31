import { AgoraVideoPlayer } from "agora-rtc-react";
// import { Grid } from "@material-ui/core";
// import { useState, useEffect } from "react";

export default function Video(props) {
  const { users, tracks } = props;
  // const [gridSpacing, setGridSpacing] = useState(12);

  // useEffect(() => {
  //   setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
  // }, [users, tracks]);

  return (
    <div
      className="h-full w-full flex gap-2 py-12 px-4"
      // style={{ height: "100%", width: "50vw" }}
      // className="grid-flow-row grid-cols-"
    >
      <div className="h-full w-1/2 border-2 border-white">
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          style={{ height: "100%", width: "100%" }}
        />
        <p className="mt-3">This is you 👆🏻</p>
      </div>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <div style={{ height: "100%" }} className="w-1/2">
                <div className="h-full">
                  <AgoraVideoPlayer
                    videoTrack={user.videoTrack}
                    key={user.uid}
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
              </div>
            );
          } else return null;
        })}
    </div>
  );
}
