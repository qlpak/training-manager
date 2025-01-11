import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./Chat";

const CoachView = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);
  const [selectedAthletePlans, setSelectedAthletePlans] = useState([]);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("Unknown");

  useEffect(() => {
    const fetchData = async () => {
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
        setError("Failed to fetch athletes;");
      }
    };

    fetchData();
  }, []);

  const handleAddPlan = async (athleteId) => {
    const name = prompt("Enter plan name:");
    const description = prompt("Enter plan description:");
    const duration = prompt("Enter plan duration (in minutes):");

    if (!name || !description || !duration) {
      alert("All fields are required!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/plans",
        { name, description, duration, id: athleteId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Plan added successfully!");
      handleViewPlans(athleteId);
    } catch (error) {
      console.error("Failed to add plan:", error);
      alert("Failed to add plan. Please try again.");
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
      setError("Failed to fetch athlete plans");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Manage Athletes</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="row">
        <div className="col-md-6">
          <h3>Athletes</h3>
          <ul className="list-group">
            {athletes.map((athlete) => (
              <li
                key={athlete.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {athlete.name}
                <div>
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
                    className="btn btn-success btn-sm"
                    onClick={() => setSelectedAthleteId(athlete.id)}
                  >
                    Chat
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* {plans there} */}
        <div className="col-md-6">
          <h3>Selected Athlete's Plans</h3>
          {selectedAthletePlans.length > 0 ? (
            <ul className="list-group">
              {selectedAthletePlans.map((plan) => (
                <li
                  key={plan.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    {plan.name} - {plan.description}
                  </span>
                  <span className="badge bg-primary rounded-pill">
                    {plan.duration} min
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No plans to display</p>
          )}
        </div>
      </div>

      {/* {chat there} */}
      <div className="mt-5">
        {selectedAthleteId ? (
          <Chat roomId={`room-${selectedAthleteId}`} username={username} />
        ) : (
          <p>Select an athlete to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default CoachView;
