import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 
import "./styles/homepage.css";
import "./styles/settingspage.css";
import "./register"


export default function SettingsPage({ currentUser }) {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [newSensor, setNewSensor] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");

  const loadUserData = () => {
    const storedUserData = localStorage.getItem("currentUser");
    return storedUserData ? JSON.parse(storedUserData) : null;
  };

  const loadSensors = () => {
    const storedSensors = localStorage.getItem("sensors");
    return storedSensors ? JSON.parse(storedSensors) : [];
  };

  const loadUsers = () => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  };

  useEffect(() => {
    const userData = loadUserData();
    setUser(userData);

    const loadedSensors = loadSensors();
    setSensors(loadedSensors);

    const loadedUsers = loadUsers();
    setUsers(Array.isArray(loadedUsers) ? loadedUsers : []);

    checkUserLogin();
  }, []);

  const checkUserLogin = () => {
    const storedUserData = localStorage.getItem("currentUser");
    if (!storedUserData) {
      navigate("/");
    }
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const notifyNonAdmin = () => {
    alert("Only admins can change settings.");
  };

  const handleCreateSensor = () => {
    console.log("Current User: ", user); // Debug line
    if (user && !user.isAdmin) {
      notifyNonAdmin(); // Notify if not an admin
      return;
    }

    if (newSensor.trim()) {
      if (sensors.length < 3) {
        const updatedSensors = [...sensors, newSensor];
        setSensors(updatedSensors);
        setNewSensor("");
        localStorage.setItem("sensors", JSON.stringify(updatedSensors));
      } else {
        alert("You can only create up to 3 sensors.");
      }
    }
  };

  const handleDeleteSensor = (sensorToDelete) => {
    const updatedSensors = sensors.filter(
      (sensor) => sensor !== sensorToDelete
    );
    setSensors(updatedSensors);
    localStorage.setItem("sensors", JSON.stringify(updatedSensors));
  };

  const handleEditSensor = (index) => {
    setEditingIndex(index);
    setEditedName(sensors[index]);
  };

  const handleSaveEdit = (index) => {
    const updatedSensors = sensors.map((sensor, i) =>
      i === index ? editedName : sensor
    );
    setSensors(updatedSensors);
    localStorage.setItem("sensors", JSON.stringify(updatedSensors));
    setEditingIndex(null);
    setEditedName("");
  };

  const handleMakeAdmin = (username) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.username === username ? { ...user, isAdmin: true } : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="home-container">
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <button className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
        <Link to="/home">
          <button className="sidebar-button">Home</button>
        </Link>
        <button className="sidebar-button">Sensors</button>
        <button className="sidebar-button">Users</button>
      </aside>

      <main className="main-content">
        <h1 className="header-title">Settings</h1>

        {/* Sign Out Button */}

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

          <div className="sensors-section2">
            <h3>Created Sensors:</h3>
            {sensors.length === 0 ? (
              <p>No sensors created yet.</p>
            ) : (
              <div className="sensor-list">
                {sensors.map((sensor, index) => (
                  <div key={index} className="sensor-item">
                    {editingIndex === index ? (
                      <>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                        <button onClick={() => handleSaveEdit(index)}>
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        {sensor}
                        {user && user.isAdmin && (
                          <>
                            <button
                              onClick={() => handleEditSensor(index)}
                              className="edit-sensor-button"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSensor(sensor)}
                              className="delete-sensor-button"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </>
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
            {users.length === 0 ? (
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
