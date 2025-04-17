import React, { useState, useRef } from "react";
import Video from "twilio-video";

const Meet = () => {
  const [room, setRoom] = useState(null);
  const [identity, setIdentity] = useState("");
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const joinRoom = async () => {
    const res = await fetch("http://localhost:5000/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity, room: "SignRoom" }),
    });
    const data = await res.json();

    Video.connect(data.token, { name: "SignRoom" }).then((room) => {
      setRoom(room);
      Video.createLocalVideoTrack().then((track) => {
        localVideoRef.current.appendChild(track.attach());
      });
      room.on("participantConnected", (participant) => {
        participant.on("trackSubscribed", (track) => {
          remoteVideoRef.current.appendChild(track.attach());
        });
      });
    });
  };

  const leaveRoom = () => {
    room.disconnect();
    setRoom(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Sign-Audio Call</h2>
      <input
        placeholder="Enter your name"
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div ref={localVideoRef} />
        <div ref={remoteVideoRef} />
      </div>
      {!room ? (
        <button onClick={joinRoom}>Join Room</button>
      ) : (
        <button onClick={leaveRoom}>Leave Room</button>
      )}
    </div>
  );
};

export default Meet;
