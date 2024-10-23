import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/adminLog.css"; // Make sure to create this CSS file for styles

export default function LogsPage({ currentUser }) {
  const navigate = useNavigate();

  const loadInitialUser = () => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(currentUser || loadInitialUser());
  const [logs, setLogs] = useState([]); // State to hold log entries

  // Check if the user is an admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      alert("You do not have permission to view this page.");
      navigate("/home"); // Redirect to homepage
    }
  }, [user, navigate]);

  // Function to sign out user and redirect to login
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  // Load logs from local storage when component mounts
  useEffect(() => {
    const storedLogs = localStorage.getItem("logs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  // Function to clear logs
  const clearLogs = () => {
    localStorage.removeItem("logs"); // Clear logs from local storage
    setLogs([]); // Update state to reflect the cleared logs
  };

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
        {/* Clear Logs button */}
        <button className="clear-logs-button" onClick={clearLogs}>
          Clear Logs
        </button>
        {/* Scrollable table for logs */}
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
                  .reverse()
                  .map(
                    (
                      log,
                      index // Reverse the array
                    ) => (
                      <tr key={index}>
                        <td>{log.date}</td>
                        <td>{log.time}</td>
                        <td>{log.user}</td>
                        <td>{log.action}</td>
                      </tr>
                    )
                  )
              ) : (
                <tr>
                  <td colSpan="4">No logs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
