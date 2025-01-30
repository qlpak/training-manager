import React, { useState, useEffect } from "react";
import socket from "../socket";
import { toast } from "react-toastify";
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
  const [name, setName] = useState("Unknown");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const username = decodedToken.name || "Unknown";
        const userId = decodedToken.id;

        setName(username);
        socket.emit("join room", { roomId, userId });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    socket.on("chat message", ({ username, message }) => {
      setMessages((prevMessages) => [...prevMessages, { username, message }]);

      if (username !== name) {
        toast.info(`New message from ${username}: ${message}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    });

    return () => {
      socket.off("chat message");
    };
  }, [roomId, name]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", { roomId, username: name, message });
      setMessage("");
    }
  };

  return (
    <div style={chatContainerStyle}>
      <h5 style={{ textAlign: "center", marginBottom: "10px" }}>
        Chat Room: {roomId}
      </h5>
      <div style={messagesStyle}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              padding: "5px 10px",
              margin: "5px 0",
              borderRadius: "5px",
              backgroundColor: msg.username === name ? "#e3f2fd" : "#bbdefb",
              alignSelf: msg.username === name ? "flex-end" : "flex-start",
            }}
          >
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div style={inputContainerStyle}>
        <input
          style={inputStyle}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button style={buttonStyle} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
