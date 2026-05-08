// src/components/UserList.jsx
import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api'; // ✅ FIX: now uses centralized API (correct port 8081)

const UserList = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    // ✅ FIX: Removed apiRequest.register({}) which was firing a real POST /users
    //    with an empty body on every page load — creating bad requests.
    //    Now uses apiRequest.getUsers() which does GET /users.
    apiRequest.getUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to load users:", err))
      .finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await apiRequest.deleteUser(id); // ✅ FIX: was fetch() hardcoded to wrong port 8080
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadgeClass = (role) => {
    if (role === "ADMIN")  return "role-badge admin";
    if (role === "AGENCY") return "role-badge agency";
    return "role-badge user";
  };

  if (loading) return (
    <div className="content-area flex items-center justify-center" style={{ minHeight: 300 }}>
      <div className="loading-spinner" />
    </div>
  );

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">All Users</h1>
        <input
          type="text"
          placeholder="Search users..."
          className="form-input"
          style={{ width: 260 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="section-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td className="row-num">{i + 1}</td>
                <td className="user-name-cell">
                  <div className="table-avatar">{u.name?.charAt(0).toUpperCase()}</div>
                  {u.name}
                </td>
                <td>{u.email}</td>
                <td><span className={roleBadgeClass(u.role)}>{u.role}</span></td>
                <td>
                  <button onClick={() => deleteUser(u.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
            No users match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;