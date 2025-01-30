import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./Chat";
import UserStatus from "../components/UserStatus";
import ProgressChart from "./ProgressChart";
import mqttClient from "../mqtt/mqttClient";

const CoachView = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);
  const [selectedAthletePlans, setSelectedAthletePlans] = useState([]);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("Unknown");
  const [query, setQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUsername(decodedToken.name || "Unknown");

        const response = await axios.get(
          "http://localhost:3000/api/users?role=athlete",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAthletes(response.data);
      } catch (err) {
        console.error("Failed to fetch athletes:", err);
        setError("Failed to fetch athletes.");
      }
    };

    fetchAthletes();
  }, []);

  const handleSearchPlans = async () => {
    try {
      const token = localStorage.getItem("token");

      const url = query.trim()
        ? `http://localhost:3000/api/plans/search?query=${query}`
        : `http://localhost:3000/api/plans`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedAthletePlans(response.data);
    } catch (err) {
      console.error("Failed to search plans:", err);
      setError("Failed to search plans.");
    }
  };

  const handleViewPlans = async (athleteId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/plans/user/${athleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedAthletePlans(response.data);
    } catch (err) {
      console.error("Failed to fetch athlete plans:", err);
      setError("Failed to fetch athlete plans.");
    }
  };

  const handleAddPlan = async (athleteId) => {
    const name = prompt("Enter plan name:");
    const description = prompt("Enter plan description:");
    const duration = prompt("Enter plan duration (in minutes):");
    const intensity = prompt("Enter training intensity (0-10):");

    if (!name || !description || !duration || intensity === null) {
      alert("All fields are required!");
      return;
    }

    if (intensity < 0 || intensity > 10) {
      alert("Intensity must be between 0 and 10!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/plans",
        { name, description, duration, intensity, userId: athleteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Plan added successfully!");
      handleViewPlans(athleteId);

      mqttClient.publish(
        `notifications/${athleteId}`,
        JSON.stringify({
          message: `Your training plan has been updated by your coach!`,
        }),
        { retain: false }
      );
    } catch (error) {
      console.error("Failed to add plan:", error);
      alert("Failed to add plan. Please try again.");
    }
  };

  const handleUpdatePlan = async (plan) => {
    const name = prompt("Enter new plan name:", plan.name);
    const description = prompt("Enter new plan description:", plan.description);
    const duration = prompt(
      "Enter new plan duration (in minutes):",
      plan.duration
    );
    const intensity = prompt("Enter new intensity (0-10):", plan.intensity);

    if (!name || !description || !duration || intensity === null) {
      alert("All fields are required!");
      return;
    }

    if (intensity < 0 || intensity > 10) {
      alert("Intensity must be between 0 and 10!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/plans/${plan.id}`,
        { name, description, duration, intensity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Plan updated successfully!");
      handleViewPlans(plan.user_id);

      mqttClient.publish(
        `notifications/${plan.user_id}`,
        JSON.stringify({
          message: `Your training plan has been updated by your coach!`,
        }),
        { retain: false }
      );
    } catch (error) {
      console.error("Failed to update plan:", error);
      alert("Failed to update plan. Please try again.");
    }
  };

  const handleDeletePlan = async (planId, userId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/plans/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Plan deleted successfully!");
      handleViewPlans(userId);
    } catch (error) {
      console.error("Failed to delete plan:", error);
      alert("Failed to delete plan. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Manage Athletes</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="row">
        {}
        <div className="col-md-12 mb-4">
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
        </div>

        {}
        <div className="col-md-6">
          <h3>Athletes</h3>
          <ul className="list-group">
            {athletes.map((athlete) => (
              <li
                key={athlete.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {athlete.name}
                <UserStatus id={athlete.id} />
                <div>
                  {}
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => handleViewPlans(athlete.id)}
                  >
                    View Plans
                  </button>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleAddPlan(athlete.id)}
                  >
                    Add Plan
                  </button>
                  <button
                    className={`btn ${
                      selectedAthleteId === athlete.id && showChat
                        ? "btn-secondary"
                        : "btn-success"
                    } btn-sm me-2`}
                    onClick={() => {
                      setSelectedAthleteId(athlete.id);
                      setShowChat((prev) =>
                        selectedAthleteId === athlete.id ? !prev : true
                      );
                    }}
                  >
                    {selectedAthleteId === athlete.id && showChat
                      ? "Hide Chat"
                      : "Chat"}
                  </button>
                  <button
                    className={`btn ${
                      selectedAthleteId === athlete.id && showChart
                        ? "btn-secondary"
                        : "btn-danger"
                    } btn-sm`}
                    onClick={() => {
                      setSelectedAthleteId(athlete.id);
                      setShowChart((prev) =>
                        selectedAthleteId === athlete.id ? !prev : true
                      );
                    }}
                  >
                    {selectedAthleteId === athlete.id && showChart
                      ? "Hide HR"
                      : "Show HR"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {}
        <div className="col-md-6">
          <h3>Selected Athlete's Plans</h3>
          {selectedAthletePlans.length > 0 ? (
            <ul className="list-group">
              {selectedAthletePlans.map((plan) => {
                let intensityClass = "badge bg-success";
                if (plan.intensity >= 4 && plan.intensity <= 7) {
                  intensityClass = "badge bg-warning text-dark";
                } else if (plan.intensity >= 8) {
                  intensityClass = "badge bg-danger";
                }

                return (
                  <li
                    key={plan.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {plan.name} - {plan.description}
                    </span>
                    <span className={`ms-2 ${intensityClass}`}>
                      Intensity: {plan.intensity}
                    </span>
                    <span className="badge bg-primary rounded-pill">
                      {plan.duration} min
                    </span>
                    <div>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleUpdatePlan(plan)}
                      >
                        Update Plan
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeletePlan(plan.id, plan.user_id)}
                      >
                        Delete Plan
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No plans to display</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-nowrap gap-5 justify-between items-start">
        {/* Chat */}
        {showChat && selectedAthleteId && (
          <div className="w-1/2">
            <h3>Chat with Athlete ID: {selectedAthleteId}</h3>
            <Chat
              roomId={`room-${selectedAthleteId}`}
              selectedAthleteId={selectedAthleteId}
              username={username}
            />
          </div>
        )}

        {/* chart HR */}
        {showChart && selectedAthleteId && (
          <div className="w-1/2">
            <h3>Heart Rate for Athlete ID: {selectedAthleteId}</h3>
            <ProgressChart athleteId={selectedAthleteId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachView;
