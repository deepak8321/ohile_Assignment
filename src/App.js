// src/App.js
import React from "react";
import "./App.css";
import Chatbot from "./components/ChatbotApp";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ohile</h1>
        <p>this app records audio and plays it back</p>
        <Chatbot />
      </header>
    </div>
  );
}

export default App;
