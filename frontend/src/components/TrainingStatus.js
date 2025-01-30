import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TrainingStatus = ({ planId, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (newStatus) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:3000/api/status/${planId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
      toast.success(`Training status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h5>Status: {status}</h5>
      <select
        className="form-select"
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="Planned">Planned</option>
        <option value="In Progress">In Progress</option>
        <option value="Finished">Finished</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default TrainingStatus;
