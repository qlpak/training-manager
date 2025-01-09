import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = () => {
    axios
      .get(`http://localhost:3000/api/users/search?query=${query}`)
      .then((response) => setUsers(response.data))
      .catch((err) => setError("Failed to fetch users"));
  };

  return (
    <div>
      <h2>Users</h2>
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={fetchUsers}>Search</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
