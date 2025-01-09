import React, { useEffect, useState } from "react";
import axios from "axios";

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/plans")
      .then((response) => setPlans(response.data))
      .catch((err) => setError("Failed to fetch plans;/"));
  }, []);

  return (
    <div>
      <h2>Plans</h2>
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
