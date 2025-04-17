import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connect, createLocalAudioTrack, createLocalVideoTrack } from "twilio-video";
import * as handtrack from "handtrackjs";  // For gesture recognition

const MeetRoom = () => {
  const { roomName } = useParams();
  const [identity] = useState(`user-${Math.floor(Math.random() * 10000)}`);
  const [room, setRoom] = useState(null);
  const localRef = useRef();
  const remoteRef = useRef();
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [recognizer, setRecognizer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize gesture recognizer
    const model = handtrack.load();
    model.then((loadedModel) => {
      setRecognizer(loadedModel);
    });

    // Create local tracks for video and audio
    const createTracks = async () => {
      try {
        const videoTrack = await createLocalVideoTrack();
        const audioTrack = await createLocalAudioTrack();
        setLocalVideoTrack(videoTrack);
        setLocalAudioTrack(audioTrack);
        localRef.current.appendChild(videoTrack.attach());
      } catch (error) {
        console.error("Error creating local tracks:", error);
      }
    };
    createTracks();
  }, []);

  useEffect(() => {
    // Fetch token and connect to Twilio room after tracks are created
    const getTokenAndJoinRoom = async () => {
      if (localVideoTrack && localAudioTrack) {
        try {
          const res = await fetch("http://localhost:5000/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identity, room: roomName }),
          });
          const { token } = await res.json();

          const connectedRoom = await connect(token, {
            name: roomName,
            tracks: [localVideoTrack, localAudioTrack],
          });

          setRoom(connectedRoom);

          connectedRoom.on("participantConnected", (participant) => {
            participant.on("trackSubscribed", (track) => {
              remoteRef.current.appendChild(track.attach());
            });
          });
        } catch (error) {
          console.error("Error joining room:", error);
        }
      }
    };
    getTokenAndJoinRoom();

    return () => {
      room?.disconnect();
    };
  }, [roomName, identity, localVideoTrack, localAudioTrack]);

  // Function to recognize gesture and convert to text (sign language to text)
  const detectGesture = async (videoElement) => {
    if (recognizer) {
      const predictions = await recognizer.detect(videoElement);
      // For example, if a gesture is detected, you convert it to text.
      if (predictions.length > 0) {
        const gestureText = "Detected Gesture: Sign Language for Hello"; // Example
        convertTextToSpeech(gestureText);
      }
    }
  };

  // Function to convert text to speech
  const convertTextToSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  // Monitor the video stream for gesture recognition
  useEffect(() => {
    const videoElement = localRef.current.querySelector("video");
    if (videoElement) {
      setInterval(() => {
        detectGesture(videoElement);
      }, 1000); // Check for gestures every second
    }
  }, [recognizer]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Meeting Room: {roomName}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full p-4">
        {/* Your local video */}
        <div className="w-full h-48 border-2 border-gray-700 rounded-lg">
          <h3 className="text-xl text-center font-semibold mb-2">You</h3>
          <div ref={localRef} />
        </div>

        {/* Remote participants */}
        <div ref={remoteRef} className="w-full h-48 border-2 border-gray-700 rounded-lg">
          <h3 className="text-xl text-center font-semibold mb-2">Participant</h3>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-600 rounded-lg shadow-lg hover:bg-red-700 transition duration-200"
        >
          Leave Meeting
        </button>
      </div>
    </div>
  );
};

export default MeetRoom;
