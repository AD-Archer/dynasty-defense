// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ user, handleSignOut, isCollapsed }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="active-user">
        {user ? <p>Welcome, {user.username}</p> : <p>Loading user...</p>}
      </div>
      <button className="sign-out-button" onClick={handleSignOut}>
        Sign Out
      </button>
      <Link to="/home">
        <button className="sidebar-button">Home</button>
      </Link>
      <Link to="/home">
        <button className="sidebar-button">Sensors</button>
      </Link>
      <Link to="/AdminLog">
        <button className="sidebar-button">Logs</button>
      </Link>
      <Link to="/settings">
        <button className="sidebar-button">Settings</button>
      </Link>
    </aside>
  );
}
