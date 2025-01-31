import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./Chat";
import UserStatus from "../components/UserStatus";
import socket from "../socket";
import ReviewForm from "../components/ReviewForm";
import TrainingStatus from "../components/TrainingStatus";
import mqttClient from "../mqtt/mqttClient";

const AthleteView = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("Unknown");
  const [query, setQuery] = useState("");
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userIdFromToken = decodedToken.id;
        const usernameFromToken = decodedToken.name || "Unknown";

        setUserId(userIdFromToken);
        setUsername(usernameFromToken);

        const response = await axios.get(
          `http://localhost:3000/api/plans/user/${userIdFromToken}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPlans(response.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        setError("Failed to fetch your plans. Please try again.");
      }
    };

    fetchPlans();

    socket.on("updateRanking", (newRanking) => {
      if (!Array.isArray(newRanking)) {
        return;
      }

      setRanking((prevRanking) => {
        const mergedRanking = [...prevRanking];
        newRanking.forEach((newEntry) => {
          if (
            newEntry.athleteId &&
            newEntry.athleteId !== "0" &&
            newEntry.athleteId !== null &&
            newEntry.athleteId.toLowerCase() !== "all"
          ) {
            const existingIndex = mergedRanking.findIndex(
              (entry) => entry.athleteId === newEntry.athleteId
            );
            if (existingIndex !== -1) {
              mergedRanking[existingIndex].calories += newEntry.calories;
            } else {
              mergedRanking.push(newEntry);
            }
          }
        });
        return mergedRanking.sort((a, b) => b.calories - a.calories);
      });
    });

    socket.emit("requestRanking");

    return () => {
      socket.off("updateRanking");
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const topic = `users/${userId}/status`;

    mqttClient.publish(topic, "Online", { retain: true });

    const handleStatusUpdate = (topic, message) => {
      const parts = topic.split("/");
      if (parts[0] === "users" && parts[2] === "status") {
        console.log(`Updated status for ${parts[1]}: ${message.toString()}`);
      }
    };

    mqttClient.subscribe("users/+/status");
    mqttClient.on("message", handleStatusUpdate);

    return () => {
      mqttClient.unsubscribe("users/+/status");
      mqttClient.off("message", handleStatusUpdate);
    };
  }, [userId]);

  const handleSearchPlans = async () => {
    try {
      const token = localStorage.getItem("token");

      const url = query.trim()
        ? `http://localhost:3000/api/plans/search?query=${query}`
        : `http://localhost:3000/api/plans/user/${userId}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlans(response.data);
    } catch (err) {
      console.error("Failed to search plans:", err);
      setError("Failed to search plans.");
    }
  };

  return (
    <div
      className="container mt-4 d-flex flex-column align-items-center"
      style={{ maxWidth: "1200px" }}
    >
      <h2 className="text-center">Athlete Dashboard</h2>
      <UserStatus id={userId} />

      <div className="d-flex flex-wrap justify-content-between w-100 mt-3">
        <div className="flex-grow-1 me-3" style={{ minWidth: "400px" }}>
          <h3>Your Training Plans</h3>
          <input
            type="text"
            className="form-control"
            placeholder="Search training plans..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleSearchPlans}>
            Search
          </button>
          {error && <p className="text-danger text-center">{error}</p>}
          {!error && plans.length === 0 ? (
            <p className="text-center">No plans yet. You can rest.</p>
          ) : (
            <div className="row">
              {plans.map((plan) => (
                <div className="col-md-5 mb-3" key={plan.id}>
                  <div className="card p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title">{plan.name}</h5>
                      <TrainingStatus
                        planId={plan.id}
                        currentStatus={plan.status}
                      />
                    </div>
                    <p className="card-text">{plan.description}</p>
                    <p className="text-muted">
                      Duration: {plan.duration} minutes
                    </p>
                    <ReviewForm planId={plan.id} userId={userId} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between w-100 mt-3">
        <div className="flex-grow-1 me-3" style={{ minWidth: "48%" }}>
          <h3>Chat with your coach</h3>
          {userId ? (
            <Chat roomId={`room-${userId}`} username={username} />
          ) : (
            <p>Loading chat...</p>
          )}
        </div>

        <div className="flex-grow-1" style={{ minWidth: "48%" }}>
          <h3 className="text-center">🥇 User Ranking</h3>
          <table className="table table-striped small-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Athlete ID</th>
                <th>Calories Burned</th>
              </tr>
            </thead>
            <tbody>
              {ranking.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No ranking data available
                  </td>
                </tr>
              ) : (
                ranking.map((athlete, index) => (
                  <tr key={athlete.athleteId}>
                    <td>{index + 1}</td>
                    <td>{athlete.athleteId}</td>
                    <td>{athlete.calories} kcal</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AthleteView;
