// Sidebar.js

// Import necessary dependencies
import React from "react";
import { Link } from "react-router-dom";

/**
 * Sidebar Component
 *
 * This component renders a sidebar that includes user information, navigation links,
 * and a sign-out button. It also handles sidebar collapse behavior.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.user - The current logged-in user information
 * @param {Function} props.handleSignOut - Function to execute when signing out
 * @param {boolean} props.isCollapsed - Flag indicating if the sidebar is collapsed
 * @returns {JSX.Element} The Sidebar component
 */
export default function Sidebar({ user, handleSignOut, isCollapsed }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Display active user information or loading message */}
      <div className="active-user">
        {user ? <p>Welcome, {user.username}</p> : <p>Loading user...</p>}
      </div>

      {/* Sign-out button triggers the handleSignOut function */}
      <button className="sign-out-button" onClick={handleSignOut}>
        Sign Out
      </button>

      {/* Navigation links to different pages within the application */}
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
