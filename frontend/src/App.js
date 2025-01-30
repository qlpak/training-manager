import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/NavigationBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminView from "./components/AdminView";
import CoachView from "./components/CoachView";
import AthleteView from "./components/AthleteView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mqttClient from "./mqtt/mqttClient";
import socket from "./socket";

const App = () => {
  const [view, setView] = useState("home");
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Unknown");
  const [userId, setUserId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const handleMqttMessage = (topic, message) => {
      console.log(`Received MQTT message on ${topic}:`, message.toString());

      const topicParts = topic.split("/");
      if (topicParts[0] === "users" && topicParts[2] === "status") {
        const athleteId = topicParts[1];
        const status = message.toString();
        if (status === "Online" && role === "coach") {
          setOnlineUsers((prev) => {
            if (!prev.has(athleteId)) {
              const newUsers = new Set(prev);
              newUsers.add(athleteId);
              toast.info(`Athlete ID ${athleteId} is now Online!`);
              return newUsers;
            }
            return prev;
          });
        }
      }

      if (topicParts[0] === "notifications") {
        const notificationData = JSON.parse(message.toString());
        toast.info(notificationData.message);
      }
    };

    if (!mqttClient.listenerCount("message")) {
      mqttClient.on("message", handleMqttMessage);
    }

    return () => {
      mqttClient.off("message", handleMqttMessage);
    };
  }, [role]);

  useEffect(() => {
    const handleMqttMessage = (topic, message) => {
      console.log(`Received MQTT message on ${topic}:`, message.toString());

      const topicParts = topic.split("/");

      if (topicParts[0] === "users" && topicParts[2] === "status") {
        const athleteId = topicParts[1];
        const status = message.toString();

        if (status === "Online" && role === "coach") {
          if (
            !onlineUsers.has(athleteId) &&
            athleteId !== "0" &&
            athleteId !== "all"
          ) {
            setOnlineUsers((prev) => new Set(prev).add(athleteId));
            toast.info(`Athlete ID ${athleteId} is now Online!`);
          }
        }
      }

      if (topicParts[0] === "notifications") {
        const notificationData = JSON.parse(message.toString());
        toast.info(notificationData.message);
      }
    };

    mqttClient.on("message", handleMqttMessage);

    return () => {
      mqttClient.off("message", handleMqttMessage);
    };
  }, [role, onlineUsers]);

  useEffect(() => {
    const handleChatMessage = ({ username: senderName, message }) => {
      if (senderName !== username) {
        toast.info(`New message from ${senderName}: ${message}`);
      }
    };
    socket.on("chat message", handleChatMessage);

    return () => {
      socket.off("chat message", handleChatMessage);
    };
  }, [username]);

  const renderView = () => {
    if (view === "login")
      return (
        <LoginForm
          setRole={setRole}
          setView={setView}
          setIsLoggedIn={setIsLoggedIn}
        />
      );
    if (view === "register") return <RegisterForm setView={setView} />;
    if (role === "admin") return <AdminView username={username} />;
    if (role === "coach") return <CoachView username={username} />;
    if (role === "athlete") return <AthleteView username={username} />;
    return <h2>Welcome to Training Manager</h2>;
  };

  return (
    <div>
      <ToastContainer />
      <Navbar
        setView={setView}
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
      />
      <div className="container mt-4">{renderView()}</div>
    </div>
  );
};

export default App;
