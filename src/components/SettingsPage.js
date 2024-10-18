import React, { useState, useEffect } from "react"; // Importing React and useState for state management
import { Link } from "react-router-dom"; // Importing Link for navigation
import "./styles/homepage.css";
import './styles/settingspage.css';

export default function SettingsPage({ currentUser }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sensors, setSensors] = useState([]); // State to store sensors
  const [newSensor, setNewSensor] = useState(""); // State for new sensor input
  const [users, setUsers] = useState([]); // State to store users
  const [user, setUser] = useState(null);

  // Load user data from local storage
  const loadUserData = () => {
    const storedUserData = localStorage.getItem("currentUser");
    return storedUserData ? JSON.parse(storedUserData) : null; // Return null if no user data found
  };

  // Load sensors from local storage
  const loadSensors = () => {
    const storedSensors = localStorage.getItem("sensors");
    return storedSensors ? JSON.parse(storedSensors) : []; // Return empty array if no sensors found
  };

  useEffect(() => {
    const userData = loadUserData();
    console.log("Loaded user data:", userData);
    setUser(userData);

    // Load sensors and set them in state
    const loadedSensors = loadSensors();
    setSensors(loadedSensors);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleCreateSensor = () => {
    if (newSensor.trim()) {
      if (sensors.length < 3) {
        // Check if user already has 3 sensors
        const updatedSensors = [...sensors, newSensor]; // Create a new sensors array with the new sensor
        setSensors(updatedSensors); // Update state with new sensors array
        setNewSensor(""); // Clear input after creation

        // Save updated sensors to local storage
        localStorage.setItem("sensors", JSON.stringify(updatedSensors));
      } else {
        alert("You can only create up to 3 sensors."); // Alert user if limit is reached
      }
    }
  };

  const handleDeleteSensor = (sensorToDelete) => {
    const updatedSensors = sensors.filter(
      (sensor) => sensor !== sensorToDelete
    ); // Remove the sensor from the array
    setSensors(updatedSensors); // Update state with new sensors array

    // Save updated sensors to local storage
    localStorage.setItem("sensors", JSON.stringify(updatedSensors));
  };

  const handleMakeAdmin = (username) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map(
        (user) =>
          user.username === username ? { ...user, isAdmin: true } : user // Ensure to use username for identification
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

          {/* Display created sensors */}
          <div className="sensors-section2">
            <h3>Created Sensors:</h3>
            {sensors.length === 0 ? (
              <p>No sensors created yet.</p>
            ) : (
              <div className="sensor-list">
                {sensors.map((sensor, index) => (
                  <div key={index} className="sensor-item">
                    {sensor}
                    {user &&
                      user.isAdmin && ( // Check if the user is an admin
                        <button
                          onClick={() => handleDeleteSensor(sensor)}
                          className="delete-sensor-button"
                        >
                          Delete
                        </button>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="user-list-section">
          <h2>All Users</h2>
          <ul className="user-list">
            {users.length === 0 ? ( // Check if users is empty
              <li>No users available</li>
            ) : (
              users.map((user) => (
                <li key={user.username} className="user-item">
                  {user.username} {user.isAdmin && "(Admin)"}
                  <button
                    onClick={() => handleMakeAdmin(user.username)}
                    disabled={user.isAdmin}
                    className="make-admin-button"
                  >
                    {user.isAdmin ? "Already Admin" : "Make Admin"}
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
