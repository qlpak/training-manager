import React, { useState, useEffect } from "react";
import axios from "axios";

const AthleteView = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");

        const userId = JSON.parse(atob(token.split(".")[1])).id;
        console.log("Fetching plans for user ID:", userId);

        const response = await axios.get(
          `http://localhost:3000/api/plans/user/${userId}`,
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
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Athlete Dashboard</h2>
      <h3>Your Training Plans</h3>
      {error && <p className="text-danger text-center">{error}</p>}
      {!error && plans.length === 0 ? (
        <p className="text-center">No plans yet. You can rest.</p>
      ) : (
        <div className="row">
          {plans.map((plan) => (
            <div className="col-md-4" key={plan.id}>
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{plan.name}</h5>
                  <p className="card-text">{plan.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Duration: {plan.duration} minutes
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AthleteView;
