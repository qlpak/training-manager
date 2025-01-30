import React, { useState } from "react";
import axios from "axios";

const AddPlan = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:3000/api/plans",
        {
          name,
          description,
          duration: parseInt(duration),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setMessage("Plan added successfully!");
        setName("");
        setDescription("");
        setDuration("");
      })
      .catch((err) => {
        console.error("Failed to add plan:", err);
        setMessage("Failed to add plan");
      });
  };

  return (
    <div>
      <h2>Add Plan</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Duration (days):</label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Plan</button>
      </form>
    </div>
  );
};

export default AddPlan;
