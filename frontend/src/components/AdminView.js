import React, { useState, useEffect } from "react";
import axios from "axios";
import UserStatus from "../components/UserStatus";

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user!");
    }
  };

  const handleUpdateRole = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/users/${id}/role`,
        { role: selectedRole[id] || "" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user role:", err);
      setError("Failed to update user role!");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Admin Dashboard</h2>
      <h3 className="text-center">Manage Users</h3>
      {error && <p className="text-danger text-center">{error}</p>}
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {user.name}
                <UserStatus id={user.id} /> {/* adding user status */}
              </td>
              <td>{user.email}</td>
              <td>
                <select
                  value={selectedRole[user.id] || user.role}
                  onChange={(e) =>
                    setSelectedRole({
                      ...selectedRole,
                      [user.id]: e.target.value,
                    })
                  }
                  className="form-select form-select-sm"
                >
                  <option value="athlete">Athlete</option>
                  <option value="coach">Coach</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleUpdateRole(user.id)}
                >
                  Update Role
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminView;
