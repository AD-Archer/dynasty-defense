import React, { useState, useEffect } from "react"; // Importing React and useState for state management
import { Link } from "react-router-dom"; // Importing Link for navigation

import "./styles/homepage.css";

export default function SettingsPage({ currentUser }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sensors, setSensors] = useState([]); // State to store sensors
  const [newSensor, setNewSensor] = useState(""); // State for new sensor input
  const [users, setUsers] = useState([]); // State to store users

  // Load user data from local storage
  const loadUserData = () => {
    const storedUserData = localStorage.getItem("users");

    // Check if there is any stored user data
    if (storedUserData) {
      // Parse the stored JSON string into an object
      return JSON.parse(storedUserData);
    } else {
      // Return an empty array if no user data is found
      return [];
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users"); // Change to your API endpoint
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    };
    fetchUsers();
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleCreateSensor = () => {
    if (newSensor.trim()) {
      setSensors([...sensors, newSensor]);
      setNewSensor(""); // Clear input after creation
    }
  };

  const handleMakeAdmin = (userId) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === userId ? { ...user, isAdmin: true } : user
      );

      // Update local storage after promoting the user
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers; // Return updated user list
    });
  };

  return (
    <div className="home-container">
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <button className="sidebar-button" onClick={toggleSidebar}>
          {isSidebarCollapsed ? "Expand" : "Collapse"}
        </button>
        <Link to="/home">
          <button className="sidebar-button">Home</button>
        </Link>
        <button className="sidebar-button">Sensors</button>
        <button className="sidebar-button">Alarms</button>
        <button className="sidebar-button settings-button active">
          Settings
        </button>
      </aside>

      <main className="main-content">
        <h1 className="header-title">Settings</h1>

        <section className="sensors-section">
          <h2>Create Custom Sensors</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="New Sensor"
              value={newSensor}
              onChange={(e) => setNewSensor(e.target.value)}
            />
            <button onClick={handleCreateSensor}>Create Sensor</button>
          </div>
        </section>

        <section className="user-list-section">
          <h2>All Users</h2>
          <ul className="user-list">
            {users.map((user) => (
              <li key={user.id} className="user-item">
                {user.name} {user.isAdmin && "(Admin)"}
                <button
                  onClick={() => handleMakeAdmin(user.id)}
                  disabled={user.isAdmin}
                  className="make-admin-button"
                >
                  {user.isAdmin ? "Already Admin" : "Make Admin"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
