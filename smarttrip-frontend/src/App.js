// src/App.js
import React, { useState } from "react";
import "./App.css";

import Login        from "./components/Login";
import CreateUser   from "./components/CreateUser";
import Dashboard    from "./components/Dashboard";
import PackageList  from "./components/PackageList";
import MyTrips      from "./components/MyTrips";
import BookingList  from "./components/BookingList"; // ✅ FIX: was never imported, AGENCY/ADMIN saw MyTrips (user-only)
import BookingForm  from "./components/BookingForm";
import CreatePackage from "./components/CreatePackage";
import UserList     from "./components/UserList";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("smarttrip_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab]       = useState("dashboard");

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("smarttrip_user", JSON.stringify(userData));
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setUser(null);
      localStorage.removeItem("smarttrip_user");
    }
  };

  if (!user) {
    return showRegister
      ? <CreateUser onRegisterComplete={() => setShowRegister(false)} />
      : <Login onLogin={handleLogin} setShowRegister={setShowRegister} />;
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", roles: ["USER", "AGENCY", "ADMIN"] },
    { id: "packages",  label: user.role === "AGENCY" ? "My Packages" : "Explore Trips", roles: ["USER", "AGENCY", "ADMIN"] },
    { id: "book-now",  label: "Book a Trip",   roles: ["USER"] },
    { id: "create-package", label: "Post New Trip", roles: ["AGENCY"] },
    { id: "bookings",  label: user.role === "USER" ? "My Trips" : "Reservations", roles: ["USER", "AGENCY", "ADMIN"] },
    { id: "users",     label: "Manage Users",  roles: ["ADMIN"] },
  ].filter(item => item.roles.includes(user.role));

  return (
    <div className="App" data-role={user.role || "USER"}>
      <div className="main-container">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span className="brand-icon">✈</span>
            <span className="brand-text">Smart<strong>Trip</strong></span>
          </div>

          <div className="sidebar-user">
            <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button onClick={handleLogout} className="btn-logout">
            Sign Out
          </button>
        </aside>

        {/* ── Main Content ── */}
        <main className="main-content">
          {activeTab === "dashboard"      && <Dashboard user={user} />}
          {activeTab === "packages"       && <PackageList user={user} />}
          {activeTab === "book-now"       && user.role === "USER"   && <BookingForm user={user} />}
          {activeTab === "create-package" && user.role === "AGENCY" && <CreatePackage user={user} />}
          {activeTab === "users"          && user.role === "ADMIN"  && <UserList />}

          {/* ✅ FIX: USER sees MyTrips; AGENCY & ADMIN see BookingList (with approve/reject controls) */}
          {activeTab === "bookings" && user.role === "USER"  && <MyTrips user={user} />}
          {activeTab === "bookings" && user.role !== "USER"  && <BookingList user={user} />}
        </main>
      </div>
    </div>
  );
}

export default App;