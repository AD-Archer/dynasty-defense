// adminLog.js

// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/adminLog.css"; // Ensure the CSS file exists for custom styles
import Sidebar from "./SideBar";

/**
 * LogsPage Component
 *
 * This component renders the admin logs page, which displays a list of log entries.
 * It includes a sidebar, log management functionalities, and ensures only admins
 * can access the page.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.currentUser - The current logged-in user
 * @returns {JSX.Element} The LogsPage component
 */
export default function LogsPage({ currentUser }) {
  const navigate = useNavigate();

  /**
   * Loads the initial user information from local storage.
   *
   * @returns {Object|null} The user object or null if not found
   */
  const loadInitialUser = () => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(currentUser || loadInitialUser());
  const [logs, setLogs] = useState([]); // State to hold log entries

  // Redirects non-admin users to the home page
  useEffect(() => {
    if (!user || !user.isAdmin) {
      alert("You do not have permission to view this page.");
      navigate("/home"); // Redirect to the homepage
    }
  }, [user, navigate]);

  /**
   * Handles user sign-out by clearing user data and redirecting to login.
   */
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  /**
   * Toggles the sidebar's collapsed state.
   */
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  // Loads logs from local storage when the component mounts
  useEffect(() => {
    const storedLogs = localStorage.getItem("logs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  /**
   * Clears all logs from both the state and local storage.
   */
  const clearLogs = () => {
    localStorage.removeItem("logs"); // Remove logs from local storage
    setLogs([]); // Clear logs from the state
  };

  return (
    <div className="logs-container">
      <Sidebar
        user={user}
        handleSignOut={handleSignOut}
        isCollapsed={isSidebarCollapsed}
      />

      <main className="main-content">
        <h1 className="header-title">Logs Page</h1>

        {/* Button to clear all logs */}
        <button className="clear-logs-button" onClick={clearLogs}>
          Clear Logs
        </button>

        {/* Logs table displaying the list of log entries */}
        <div className="logs-table-container">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs
                  .slice()
                  .reverse() // Display the logs in reverse order (most recent first)
                  .map((log, index) => (
                    <tr key={index}>
                      <td>{log.date}</td>
                      <td>{log.time}</td>
                      <td>{log.user}</td>
                      <td>{log.action}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4">No logs available</td>{" "}
                  {/* Placeholder if no logs */}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
