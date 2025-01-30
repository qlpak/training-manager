import React, { useState, useEffect } from "react";
import mqttClient from "../mqtt/mqttClient";

const UserStatus = ({ id }) => {
  const [status, setStatus] = useState("Offline");

  useEffect(() => {
    const topic = `users/${id}/status`;

    console.log(`Subscribing to topic: ${topic}`);
    mqttClient.subscribe(topic);

    mqttClient.on("message", (topicReceived, message) => {
      console.log(
        `Received topic: ${topicReceived}, message: ${message.toString()}`
      );
      if (topicReceived === topic) {
        setStatus(message.toString());
      }
    });

    return () => {
      console.log(`Unsubscribing from topic: ${topic}`);
      mqttClient.unsubscribe(topic);
    };
  }, [id]);

  const statusStyle = {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "15px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "12px",
    textAlign: "center",
    backgroundColor: status === "Online" ? "green" : "gray",
  };

  return (
    <div>
      <span style={statusStyle}>{status}</span>
    </div>
  );
};

export default UserStatus;
