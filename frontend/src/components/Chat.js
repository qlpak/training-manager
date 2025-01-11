import React, { useState, useEffect } from "react";
import socket from "../socket";
import {
  chatContainerStyle,
  messagesStyle,
  inputContainerStyle,
  inputStyle,
  buttonStyle,
} from "./ChatStyles";

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.emit("join room", roomId);

    socket.on("chat message", ({ username, message }) => {
      setMessages((prevMessages) => [...prevMessages, { username, message }]);
    });

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded token:", decodedToken);
      setUsername(decodedToken.name || decodedToken.username || "Unknown");
    }

    return () => {
      socket.off("chat message");
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", { roomId, username, message });
      socket.emit("chat message", { roomId, username, message });
      setMessage("");
    }
  };

  return (
    <div style={chatContainerStyle}>
      <h5>Chat Room: {roomId}</h5>
      <div style={messagesStyle}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <div style={inputContainerStyle}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          style={inputStyle}
        />
        <button onClick={handleSendMessage} style={buttonStyle}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
