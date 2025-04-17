// src/pages/Practice.jsx

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const GIPHY_API_KEY = "YOUR_GIPHY_API_KEY"; // Replace this

const Practice = () => {
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState('');
  const [gifUrl, setGifUrl] = useState('');

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      const blob = await (await fetch(imageSrc)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'gesture.jpg');

      try {
        const response = await axios.post('http://localhost:5000/predict', formData);
        const predicted = response.data.prediction;
        setPrediction(predicted);
        fetchGif(predicted);
      } catch (error) {
        console.error('Prediction error:', error);
      }
    }
  };

  const fetchGif = async (text) => {
    try {
      const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
        params: {
          api_key: GIPHY_API_KEY,
          q: `ASL ${text}`,
          limit: 1
        }
      });

      const url = response.data.data[0]?.images?.downsized?.url;
      if (url) {
        setGifUrl(url);
      } else {
        setGifUrl('');
      }
    } catch (error) {
      console.error('Giphy API error:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(capture, 2000); // Capture every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Sign Language Practice</h1>
      <div className="flex gap-6">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded shadow-lg border-4 border-blue-500"
          width={400}
          height={300}
        />

        <div className="flex flex-col items-center gap-4">
          <p className="text-xl font-semibold text-green-600">
            Prediction: {prediction || 'Waiting...'}
          </p>
          {gifUrl ? (
            <img
              src={gifUrl}
              alt="Gesture Guide"
              className="w-64 h-64 rounded shadow"
            />
          ) : (
            <p className="text-gray-500">No GIF available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
