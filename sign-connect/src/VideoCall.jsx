// VideoCall.js
import React, { useEffect, useRef, useState } from "react";
import daily from "@daily-co/daily-js";

const VideoCall = ({ roomUrl }) => {
  const videoRef = useRef(null);
  const [callObject, setCallObject] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const dailyRoom = daily.createClient();
    setCallObject(dailyRoom);

    return () => {
      if (dailyRoom) {
        dailyRoom.destroy();
      }
    };
  }, []);

  const joinCall = () => {
    if (callObject) {
      callObject.join({ url: roomUrl });
      setIsJoined(true);
    }
  };

  const leaveCall = () => {
    if (callObject) {
      callObject.leave();
      setIsJoined(false);
    }
  };

  // Attach the video stream
  useEffect(() => {
    if (callObject && isJoined) {
      callObject.on("stream-created", (event) => {
        if (videoRef.current) {
          const stream = event.stream;
          videoRef.current.srcObject = stream;
        }
      });
    }
  }, [callObject, isJoined]);

  return (
    <div>
      <h1>Sign Language Video Call</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto" }}
      />
      {!isJoined ? (
        <button onClick={joinCall}>Join Call</button>
      ) : (
        <button onClick={leaveCall}>Leave Call</button>
      )}
    </div>
  );
};

export default VideoCall;
