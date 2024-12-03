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

  // Load and deduplicate logs on mount
  useEffect(() => {
    const loadAndDedupeLogs = () => {
      const storedLogs = JSON.parse(localStorage.getItem("logs") || "[]");
      
      // Create a map to track unique logs
      const uniqueLogsMap = new Map();
      
      // Process logs to keep the most recent entries
      storedLogs.forEach(log => {
        // Create a unique key combining relevant properties
        const key = `${log.date}-${log.time}-${log.user}-${log.action}`;
        
        // Only keep the first occurrence
        if (!uniqueLogsMap.has(key)) {
          uniqueLogsMap.set(key, log);
        }
      });
      
      // Convert back to array and sort by newest first
      const deduplicatedLogs = Array.from(uniqueLogsMap.values())
        .sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA; // Sort in descending order (newest first)
        });
      
      // Update localStorage with deduplicated logs
      localStorage.setItem("logs", JSON.stringify(deduplicatedLogs));
      setLogs(deduplicatedLogs);
    };

    loadAndDedupeLogs();
  }, []);

  /**
   * Clears all logs from both the state and local storage.
   */
  const clearLogs = () => {
    if (window.confirm("Are you sure you want to clear all logs? This action cannot be undone.")) {
      localStorage.setItem("logs", JSON.stringify([]));
      setLogs([]);
      
      // Log the clearing action itself
      const clearLog = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        user: user?.username || "Unknown User",
        action: "Cleared all logs"
      };
      
      localStorage.setItem("logs", JSON.stringify([clearLog]));
      setLogs([clearLog]);
    }
  };

  // Function to export logs as CSV
  const exportLogs = () => {
    const csvContent = [
      ['Date', 'Time', 'User', 'Action'],
      ...logs.map(log => [log.date, log.time, log.user, log.action])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="logs-container">
      <Sidebar
        user={user}
        handleSignOut={handleSignOut}
        isCollapsed={isSidebarCollapsed}
      />

      <main className="main-content">
        <h1 className="header-title">System Logs</h1>

        <div className="logs-actions">
          <button 
            className="clear-logs-button" 
            onClick={clearLogs}
            title="Clear all logs"
          >
            Clear
          </button>
          <button 
            className="export-logs-button" 
            onClick={exportLogs}
            title="Export logs to CSV"
          >
            Export
          </button>
        </div>

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
                logs.map((log, index) => (
                  <tr key={`${log.date}-${log.time}-${log.user}-${log.action}-${index}`}>
                    <td>{log.date}</td>
                    <td>{log.time}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-logs-message">
                    No logs available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
