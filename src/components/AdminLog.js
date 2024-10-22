import React, { useEffect, useState } from "react";
import "./styles/homepage.css";
import "./styles/adminLog.css";

export default function AdminLog() {
  const [logs, setLogs] = useState([]);

  // Function to retrieve logs from local storage
  const getLogs = () => {
    const storedLogs = JSON.parse(localStorage.getItem("systemLog")) || [];
    setLogs(storedLogs);
  };

  // Function to clear the logs
  const clearLogs = () => {
    localStorage.removeItem("systemLog");
    setLogs([]);
  };

  // UseEffect to load logs on component mount
  useEffect(() => {
    getLogs();
  }, []);

  return (
    <div className="container">
      <h1>Admin Log</h1>
      {/* <div id="logContainer" className="log-container">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              [{new Date(log.timestamp).toLocaleString()}] {log.action}
            </div>
          ))
        ) : (
          <div>No logs available.</div>
        )}
      </div>
      <button
        id="clearLogButton"
        onClick={clearLogs}
        className="clear-log-button"
      >
        Clear Log
      </button> */}
    </div>
  );
}
