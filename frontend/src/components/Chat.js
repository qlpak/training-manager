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

const Chat = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessages([]);

    socket.emit("join room", { roomId, username });
  }, [roomId, username]);

  useEffect(() => {
    const handleMessage = ({ username, message }) => {
      setMessages((prevMessages) => [...prevMessages, { username, message }]);

      if (username !== username) {
        // toast.info(`New message ${username}: ${message}`, {
        //   position: "bottom-right",
        //   autoClose: 3000,
        //   hideProgressBar: true,
        // });
      }
    };

    socket.on("chat message", handleMessage);

    return () => {
      socket.off("chat message", handleMessage);
    };
  }, [roomId, username]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", { roomId, username, message });
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
              backgroundColor:
                msg.username === username ? "#e3f2fd" : "#bbdefb",
              alignSelf: msg.username === username ? "flex-end" : "flex-start",
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
