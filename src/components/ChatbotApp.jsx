// src/Chatbot.js
import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const audioChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const audioPlayerRef = useRef(new Audio());

  useEffect(() => {
    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [recording]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          setMessages([
            ...messages,
            { content: <audio controls src={audioUrl} />, isUser: true },
          ]);
          audioChunksRef.current = [];

          // Auto-play the recorded audio
          audioPlayerRef.current.src = audioUrl;
          audioPlayerRef.current.play();
        };

        mediaRecorderRef.current.start();
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSpeechRecognition = () => {
    setRecording(!recording);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.isUser ? "user-message" : "bot-message"}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          className="input-box"
          placeholder="Type your message..."
        />
        <button
          className={`record-btn ${recording ? "recording" : ""}`}
          onClick={handleSpeechRecognition}
        >
          {recording ? "Stop" : "Start Recording"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
