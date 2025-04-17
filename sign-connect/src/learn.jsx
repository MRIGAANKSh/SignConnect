import React, { useState, useEffect } from 'react';

// Dictionary of sign gestures for some basic words
const signDictionary = {
  "hello": [
    { leftArm: 45, rightArm: 90, leftHand: "palm-out", rightHand: "palm-out", description: "Right hand at head level, palm forward" },
    { leftArm: 45, rightArm: 120, leftHand: "palm-out", rightHand: "palm-out", description: "Move right hand away from head" },
    { leftArm: 45, rightArm: 90, leftHand: "palm-out", rightHand: "palm-out", description: "Return to starting position" }
  ],
  "thank you": [
    { leftArm: 30, rightArm: 30, leftHand: "palm-up", rightHand: "palm-up", description: "Start with flat hand at mouth" },
    { leftArm: 30, rightArm: 75, leftHand: "palm-up", rightHand: "palm-up", description: "Move hand outward and down" }
  ],
  "please": [
    { leftArm: 30, rightArm: 45, leftHand: "palm-up", rightHand: "flat", description: "Right hand flat against chest" },
    { leftArm: 30, rightArm: 45, leftHand: "palm-up", rightHand: "flat", description: "Rub in circular motion" }
  ],
  "sorry": [
    { leftArm: 45, rightArm: 45, leftHand: "fist", rightHand: "fist", description: "Make fist with right hand" },
    { leftArm: 45, rightArm: 45, leftHand: "fist", rightHand: "fist", description: "Rub in circular motion on chest" }
  ],
  "learn": [
    { leftArm: 30, rightArm: 60, leftHand: "open", rightHand: "pinch", description: "Start with fingers pinched at forehead" },
    { leftArm: 30, rightArm: 90, leftHand: "open", rightHand: "open", description: "Open hand as you pull away from forehead" }
  ],
  "yes": [
    { leftArm: 30, rightArm: 45, leftHand: "relaxed", rightHand: "fist", description: "Make a fist with right hand" },
    { leftArm: 30, rightArm: 30, leftHand: "relaxed", rightHand: "fist", description: "Nod fist up and down like nodding head" }
  ],
  "no": [
    { leftArm: 30, rightArm: 60, leftHand: "relaxed", rightHand: "palm-out", description: "Right hand up, palm facing out" },
    { leftArm: 30, rightArm: 60, leftHand: "relaxed", rightHand: "palm-out", description: "Move hand side to side like shaking head" }
  ],
  "name": [
    { leftArm: 45, rightArm: 45, leftHand: "index-point", rightHand: "index-point", description: "Both index fingers extended" },
    { leftArm: 45, rightArm: 45, leftHand: "index-point", rightHand: "index-point", description: "Tap fingers together twice" }
  ]
};

// Default pose for the stickman
const defaultPose = {
  leftArm: 30,
  rightArm: 30,
  leftHand: "relaxed",
  rightHand: "relaxed",
  description: "Neutral position"
};

const SignLanguageLearner = () => {
  const [inputText, setInputText] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pose, setPose] = useState(defaultPose);
  const [speed, setSpeed] = useState(1000); // Animation speed in ms

  // Handle demonstration of sign language
  const demonstrateSign = () => {
    const words = inputText.toLowerCase().trim().split(/\s+/);
    if (words.length === 0 || words[0] === "") return;
    
    const word = words[0];
    setCurrentWord(word);
    
    // Get animation steps for the word if it exists in our dictionary
    const steps = signDictionary[word] || [];
    
    if (steps.length === 0) {
      setPose(defaultPose);
      return;
    }
    
    setAnimationSteps(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  // Animation effect
  useEffect(() => {
    if (!isAnimating || animationSteps.length === 0) return;
    
    // Set the current pose
    setPose(animationSteps[currentStep]);
    
    // Set up timer for next step
    const timer = setTimeout(() => {
      if (currentStep < animationSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsAnimating(false);
        // Reset to default after complete animation
        setTimeout(() => setPose(defaultPose), speed);
      }
    }, speed);
    
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, animationSteps, speed]);

  // Handle speed change
  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };

  // Get CSS transform for arms
  const getArmTransform = (angle, isLeft) => {
    return {
      transform: `rotate(${isLeft ? angle : -angle}deg)`
    };
  };

  // Get list of supported words from dictionary
  const supportedWords = Object.keys(signDictionary).join(", ");

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Sign Language Learning Module</h1>
      
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a word to learn sign language"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={demonstrateSign} 
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Show Sign
        </button>
      </div>
      
      <div className="text-gray-600 italic text-sm mb-4">
        <p>Currently supported words: {supportedWords}</p>
      </div>
      
      <div className="flex items-center mb-6 gap-3">
        <label className="text-gray-700">Animation Speed: </label>
        <input
          type="range"
          min="500"
          max="2000"
          step="100"
          value={speed}
          onChange={handleSpeedChange}
          className="flex-1 max-w-md"
        />
        <span className="text-gray-700">{speed / 1000}s</span>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg h-96 relative mb-6">
        {/* Stickman animation area */}
        <div className="w-full h-full flex justify-center items-center">
          <div className="relative h-80 w-40">
            {/* Head */}
            <div className="w-12 h-12 bg-gray-800 rounded-full absolute left-1/2 transform -translate-x-1/2"></div>
            
            {/* Body */}
            <div className="w-1 h-32 bg-gray-800 absolute top-12 left-1/2 transform -translate-x-1/2"></div>
            
            {/* Arms */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-32">
              {/* Left arm */}
              <div 
                className="w-16 h-1 bg-gray-800 absolute left-0 origin-left"
                style={getArmTransform(pose.leftArm, true)}
              >
                {/* Left hand */}
                <div className="absolute -top-2 -left-2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-gray-800 rounded-full">
                      {pose.leftHand === "palm-out" && (
                        <>
                          <div className="absolute w-1 h-3 bg-gray-800 rounded-full -top-3 -left-1 transform rotate-[-30deg]"></div>
                          <div className="absolute w-1 h-3 bg-gray-800 rounded-full -top-3 left-0"></div>
                          <div className="absolute w-1 h-3 bg-gray-800 rounded-full -top-3 left-1"></div>
                          <div className="absolute w-1 h-3 bg-gray-800 rounded-full -top-3 left-2"></div>
                          <div className="absolute w-1 h-2 bg-gray-800 rounded-full -top-2 left-3"></div>
                        </>
                      )}
                      {pose.leftHand === "fist" && (
                        <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
                      )}
                      {/* Add other hand poses as needed */}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right arm */}
              <div 
                className="w-16 h-1 bg-gray-800 absolute right-0 origin-right"
                style={getArmTransform(pose.rightArm, false)}
              >
                {/* Right hand */}
                <div className="absolute -top-2 -right-2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-gray-800 rounded-full">
                      {pose.rightHand === "palm-out" && (
                        <>
                          <div className="absolute w-1 h-3 bg-gray-800 rounded-full -top-3 -right-1 transform rotate-[30deg]"></div>
                          <div className="absolute w-1 h-3 bg-gray-800 rounded-full -top-3 right-0"></div>
                          <div className="absolute w-1 h-3 bg-gray-800 rounded-full -top-3 right-1"></div>
                          <div className="absolute w-1 h-3 bg-gray-800 rounded-full -top-3 right-2"></div>
                          <div className="absolute w-1 h-2 bg-gray-800 rounded-full -top-2 right-3"></div>
                        </>
                      )}
                      {pose.rightHand === "fist" && (
                        <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
                      )}
                      {/* Add other hand poses as needed */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legs */}
            <div className="absolute top-44 left-1/2 transform -translate-x-1/2 w-14 flex justify-between">
              <div className="w-1 h-24 bg-gray-800"></div>
              <div className="w-1 h-24 bg-gray-800"></div>
            </div>
          </div>
        </div>
        
        {/* Word display */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <div className="font-bold text-xl text-blue-700">{currentWord}</div>
          <div className="text-gray-600 mt-1">{pose.description}</div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h3 className="font-medium text-blue-800 mb-2">How to use:</h3>
        <ol className="list-decimal pl-5 space-y-1 text-gray-700">
          <li>Type a word from our supported vocabulary</li>
          <li>Click "Show Sign" to see the demonstration</li>
          <li>Watch the stickman perform the sign language gesture</li>
          <li>Use the slider to adjust animation speed</li>
        </ol>
      </div>
    </div>
  );
};

export default SignLanguageLearner;