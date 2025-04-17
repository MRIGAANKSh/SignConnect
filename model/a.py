import cv2
import pickle
import numpy as np
import mediapipe as mp
import warnings
import os
import pygame
from elevenlabs import generate, set_api_key

# Suppress specific warnings
warnings.filterwarnings("ignore", message="SymbolDatabase.GetPrototype() is deprecated")

# Set your ElevenLabs API key
set_api_key("sk_a6b3c93dbad9d47482eba31655b28d1f02f676fd811bf149")  # Replace with your API key

# Function to use ElevenLabs voice with pygame
def speak_with_elevenlabs(text, voice="Aria"):
    try:
        audio = generate(
            text=f"Predicted sign is {text}",
            voice=voice,
            model="eleven_monolingual_v1"
        )
        file_path = "output.mp3"

        # If file already exists, try to remove it
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                print("Waiting to unlock file...")
                pygame.mixer.quit()
                os.remove(file_path)

        with open(file_path, "wb") as f:
            f.write(audio)

        # Play using pygame
        pygame.mixer.init()
        pygame.mixer.music.load(file_path)
        pygame.mixer.music.play()

        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)

        pygame.mixer.music.stop()
        pygame.mixer.quit()

        os.remove(file_path)

    except Exception as e:
        print("ElevenLabs voice error:", e)

# Load the trained model
try:
    with open('./model.p', 'rb') as f:
        model_dict = pickle.load(f)
        model = model_dict['model']
except Exception as e:
    print("Error loading model:", e)
    exit()

# Labels dictionary
labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J',
    10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S',
    19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z', 26: 'Hello',
    27: 'Done', 28: 'Thank You', 29: 'I Love you', 30: 'Sorry', 31: 'Please',
    32: 'You are welcome.'
}

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5)

# Start webcam
cap = cv2.VideoCapture(0)
last_prediction = ""
cooldown = 30  # Number of frames to wait before speaking again
counter = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    h, w, _ = frame.shape
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            x_, y_ = [], []
            data_aux = []

            for lm in hand_landmarks.landmark:
                x_.append(lm.x)
                y_.append(lm.y)

            for lm in hand_landmarks.landmark:
                data_aux.append(lm.x - min(x_))
                data_aux.append(lm.y - min(y_))

            try:
                prediction = model.predict([np.asarray(data_aux)])
                prediction_proba = model.predict_proba([np.asarray(data_aux)])
                confidence = max(prediction_proba[0])
                label = labels_dict[int(prediction[0])]

                if confidence > 0.4:
                    cv2.putText(frame, f'{label} ({confidence:.2f})', (10, 50),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3)

                    if label != last_prediction or counter >= cooldown:
                        speak_with_elevenlabs(label)
                        last_prediction = label
                        counter = 0
                else:
                    cv2.putText(frame, 'Low confidence', (10, 50),
                                cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 255), 3)
            except Exception as e:
                print("Prediction error:", e)

    counter += 1
    cv2.imshow("Sign Language Translator", frame)

    if cv2.waitKey(1) & 0xFF == 27:  # ESC to exit
        break

cap.release()
cv2.destroyAllWindows()
