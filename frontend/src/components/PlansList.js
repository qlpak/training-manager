import React, { useState, useEffect } from "react";
import axios from "axios";

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const fetchPlans = () => {
    axios
      .get(`http://localhost:3000/api/plans/search?query=${query}`)
      .then((response) => setPlans(response.data))
      .catch((err) => setError("Failed to fetch plans"));
  };

  return (
    <div>
      <h2>Plans</h2>
      <div>
        <input
          type="text"
          placeholder="Search plans..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={fetchPlans}>Search</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>
            <strong>{plan.name}</strong>: {plan.description} ({plan.duration}{" "}
            days)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlansList;
