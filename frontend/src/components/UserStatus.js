import React, { useState, useEffect } from "react";
import mqttClient from "../mqtt/mqttClient";

const UserStatus = ({ id }) => {
  const [status, setStatus] = useState("Offline");

  useEffect(() => {
    if (!id) return;

    const topic = `users/${id}/status`;

    console.log(`Subscribing to topic: ${topic}`);
    mqttClient.subscribe(topic);

    const handleMessage = (topicReceived, message) => {
      if (topicReceived === topic) {
        setStatus(message.toString());
      }
    };

    mqttClient.on("message", handleMessage);

    mqttClient.publish(topic, "Online", { retain: true });

    return () => {
      console.log(`Unsubscribing from topic: ${topic}`);
      mqttClient.unsubscribe(topic);
      mqttClient.off("message", handleMessage);
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

  return <span style={statusStyle}>{status}</span>;
};

export default UserStatus;
