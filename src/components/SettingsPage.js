import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcrypt
import "./styles/homepage.css";
import "./styles/settingspage.css";

export default function SettingsPage() {
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

  // Load user data from localStorage
  const loadUserData = () => {
    const storedUserData = localStorage.getItem("currentUser");
    return storedUserData ? JSON.parse(storedUserData) : null;
  };

  // Load sensors from localStorage
  const loadSensors = () => {
    const storedSensors = localStorage.getItem("sensors");
    return storedSensors ? JSON.parse(storedSensors) : [];
  };

  // Load users from localStorage
  const loadUsers = () => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const usersObj = JSON.parse(storedUsers);
      return Object.values(usersObj); // Convert object to an array of users
    }
    return [];
  };

  useEffect(() => {
    const userData = loadUserData();
    if (!userData) {
      navigate("/"); // Redirect if no user data is found
    } else {
      setUser(userData);
    }

    const loadedSensors = loadSensors();
    setSensors(loadedSensors);

    const loadedUsers = loadUsers();

    // Check for users named "admin" and retain only one
    const adminCount = loadedUsers.filter(
      (u) => u.username.toLowerCase() === "admin"
    ).length;
    if (adminCount > 1) {
      // Keep only one "admin" user and remove the rest
      const filteredUsers = loadedUsers.filter(
        (u) => u.username.toLowerCase() !== "admin"
      ); // Keep all non-"admin" users
      const adminUser = loadedUsers.find(
        (u) => u.username.toLowerCase() === "admin"
      ); // Keep one "admin" user
      const updatedUsers = adminUser
        ? [...filteredUsers, adminUser]
        : filteredUsers;

      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    } else {
      setUsers(loadedUsers);
    }
  }, [navigate]);

  const notifyNonAdmin = () => {
    alert("Only admins can change settings.");
  };

  // Function to create a new sensor
  const handleCreateSensor = () => {
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    if (!newSensor.trim()) {
      alert("Please enter a sensor name.");
      return;
    }

    if (sensors.length < 3) {
      const updatedSensors = [...sensors, newSensor];
      setSensors(updatedSensors);
      setNewSensor("");
      localStorage.setItem("sensors", JSON.stringify(updatedSensors));
    } else {
      alert("You can only create up to 3 sensors.");
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

  // Function to edit a user's details
  const handleEditUser = (username) => {
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    if (username === "admin") {
      alert("You cannot edit the default admin account.");
      return;
    }

    const userToEdit = users.find((user) => user.username === username);
    setEditingUser(userToEdit);
    setNewUserName(userToEdit?.username || "");
    setNewPassword(userToEdit?.password || "");
  };

  // Hash and save changes to a user's name and password
  const handleSaveUserEdit = async () => {
    if (!editingUser) return;

    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.username === editingUser.username) {
          return { ...user, username: newUserName, password: hashedPassword }; // Use hashed password
        }
        return user;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });

    const updatedCurrentUser = {
      ...editingUser,
      username: newUserName,
      password: hashedPassword,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    setEditingUser(null);
    setNewUserName("");
    setNewPassword("");
  };

  // Function to delete a user
  const handleDeleteUser = (username) => {
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    if (username === "admin") {
      alert("You cannot delete the default admin account.");
      return;
    }

    // Prevent deletion of the current user's account
    if (username === user.username) {
      alert("You cannot delete your own account.");
      return;
    }

    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter(
        (user) => user.username !== username
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  // Function to toggle admin status of a user
  const handleToggleAdmin = (username) => {
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    // Prevent toggling admin status for the "admin" user
    if (username.toLowerCase() === "admin") {
      alert(
        "You cannot remove admin privileges from the default admin account."
      );
      return;
    }

    // Prevent toggling admin status for the current user
    if (username === user.username) {
      alert("You cannot remove your own admin privileges.");
      return;
    }

    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.username.toLowerCase() === username.toLowerCase()) {
          return { ...user, isAdmin: !user.isAdmin }; // Toggle admin status
        }
        return user;
      });
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
                        <span>{sensor}</span>
                        <button onClick={() => handleEditSensor(index)}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteSensor(sensor)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="users-section">
          <h2>Manage Users</h2>

          <div className="users-list">
            {users.length === 0 ? (
              <p>No users available.</p>
            ) : (
              users.map((user) => (
                <div key={user.username} className="user-item">
                  {editingUser?.username === user.username ? (
                    <>
                      <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button onClick={handleSaveUserEdit}>Save</button>
                    </>
                  ) : (
                    <>
                      <span>
                        {user.username} {user.isAdmin ? "(Admin)" : ""}
                      </span>
                      <button onClick={() => handleEditUser(user.username)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteUser(user.username)}>
                        Delete
                      </button>
                      <button onClick={() => handleToggleAdmin(user.username)}>
                        {user.isAdmin ? "Remove Admin" : "Make Admin"}
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
