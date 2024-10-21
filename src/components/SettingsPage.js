import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/homepage.css";
import "./styles/settingspage.css";

export default function SettingsPage({ currentUser }) {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [newSensor, setNewSensor] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Function to load user data from localStorage
  const loadUserData = () => {
    const storedUserData = localStorage.getItem("currentUser");
    return storedUserData ? JSON.parse(storedUserData) : null;
  };

  // Function to load sensors from localStorage
  const loadSensors = () => {
    const storedSensors = localStorage.getItem("sensors");
    return storedSensors ? JSON.parse(storedSensors) : [];
  };

  // Function to load users from localStorage
  const loadUsers = () => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const usersObj = JSON.parse(storedUsers);
      return Object.values(usersObj); // Convert object to an array of users
    }
    return [];
  };

  // useEffect to load initial data on component mount
  useEffect(() => {
    const userData = loadUserData();
    setUser(userData);

    const loadedSensors = loadSensors();
    setSensors(loadedSensors);

    const loadedUsers = loadUsers();
    setUsers(loadedUsers);

    checkUserLogin(); // Ensure the user is logged in
  }, []);

  // Function to check if user is logged in; if not, redirect to homepage
  const checkUserLogin = () => {
    const storedUserData = localStorage.getItem("currentUser");
    if (!storedUserData) {
      navigate("/");
    }
  };

  // Toggle sidebar collapse/expand
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Function to notify non-admin users attempting restricted actions
  const notifyNonAdmin = () => {
    alert("Only admins can change settings.");
  };

  // Function to handle creating a new sensor
  const handleCreateSensor = () => {
    if (user && !user.isAdmin) {
      notifyNonAdmin(); // Notify if not an admin
      return;
    }

    if (!newSensor.trim()) {
      alert("Please enter a sensor name."); // Display alert if sensor name is empty
      return;
    }

    if (sensors.length < 3) {
      const updatedSensors = [...sensors, newSensor];
      setSensors(updatedSensors);
      setNewSensor("");
      localStorage.setItem("sensors", JSON.stringify(updatedSensors));
    } else {
      alert("You can only create up to 3 sensors."); // Alert if trying to add more than 3 sensors
    }
  };

  // Function to delete a sensor
  const handleDeleteSensor = (sensorToDelete) => {
    const updatedSensors = sensors.filter(
      (sensor) => sensor !== sensorToDelete
    );
    setSensors(updatedSensors);
    localStorage.setItem("sensors", JSON.stringify(updatedSensors));
  };

  // Function to start editing a sensor
  const handleEditSensor = (index) => {
    setEditingIndex(index);
    setEditedName(sensors[index]);
  };

  // Function to save changes to a sensor name
  const handleSaveEdit = (index) => {
    const updatedSensors = sensors.map((sensor, i) =>
      i === index ? editedName : sensor
    );
    setSensors(updatedSensors);
    localStorage.setItem("sensors", JSON.stringify(updatedSensors));
    setEditingIndex(null);
    setEditedName("");
  };

  // Toggle admin status for a user
  const handleToggleAdmin = (username) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.username === username ? { ...user, isAdmin: !user.isAdmin } : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  // Function to edit a user's details
  const handleEditUser = (username) => {
    const userToEdit = users.find((user) => user.username === username);
    setEditingUser(userToEdit);
    setNewUserName(userToEdit.username);
    setNewPassword(userToEdit.password);
  };

  // Save changes to a user's name and password
  const handleSaveUserEdit = () => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.username === editingUser.username
          ? { ...user, username: newUserName, password: newPassword }
          : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
    setEditingUser(null);
    setNewUserName("");
    setNewPassword("");
  };

  // Function to delete a user
  const handleDeleteUser = (username) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter(
        (user) => user.username !== username
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  // Function to handle user sign out
  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="home-container">
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
        <button className="sidebar-button">Sensors</button>
        <button className="sidebar-button">Users</button>
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
                    onClick={() => handleToggleAdmin(user.username)}
                    className="toggle-admin-button"
                  >
                    {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                  </button>
                  <button
                    onClick={() => handleEditUser(user.username)}
                    className="edit-user-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.username)}
                    className="delete-user-button"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>

          {editingUser && (
            <div className="edit-user-form">
              <h3>Edit User</h3>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="New Username"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
              <button onClick={handleSaveUserEdit}>Save Changes</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
