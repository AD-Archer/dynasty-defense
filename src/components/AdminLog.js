import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/adminLog.css"; // Make sure to create this CSS file for styles

export default function LogsPage({ currentUser }) {
  const navigate = useNavigate();

  // Move the loadInitialUser function above the useState calls
  const loadInitialUser = () => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(currentUser || loadInitialUser());

  // Function to sign out user and redirect to login
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div className="logs-container">
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="active-user">
          {user ? <p>Welcome, {user.username}</p> : <p>Loading user...</p>}
        </div>
        <button className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
        <Link to="/home">
          <button className="sidebar-button">Home</button>
        </Link>
        <Link to="/settings">
          <button className="sidebar-button">Sensors</button>
        </Link>
        <Link to="/AdminLog">
          <button className="sidebar-button">Logs</button>
        </Link>
        <Link to="/settings">
          <button className="sidebar-button">Settings</button>
        </Link>
      </aside>

      <main className="main-content">
        <h1 className="header-title">Logs Page</h1>
        {/* Additional content for the logs page can be added here */}
      </main>
    </div>
  );
}
