// settingspage.js

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import "./styles/homepage.css"; // Import homepage styles
import "./styles/settingspage.css"; // Import settings page styles
import Sidebar from "./SideBar"; // Import Sidebar component
import Footer from "./Footer"; // Import Footer component

/**
 * SettingsPage component handles user management and settings functionalities
 * for the application. Admin users can edit, delete, and change the admin
 * status of other users.
 * @component
 */
export default function SettingsPage() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Sidebar state
  const [users, setUsers] = useState([]); // State to store list of users
  const [user, setUser] = useState(null); // State to store current user
  const [editingUser, setEditingUser] = useState(null); // State for user being edited
  const [newUserName, setNewUserName] = useState(""); // State for editing user's name
  const [newPassword, setNewPassword] = useState(""); // State for editing user's password
  const [newSensor, setNewSensor] = useState({
    name: '',
    icon: '',
    description: ''
  });
  const [customSensors, setCustomSensors] = useState([]);
  const [logSettings, setLogSettings] = useState({
    maxEntries: parseInt(localStorage.getItem('logMaxEntries')) || 1000,
    retentionDays: parseInt(localStorage.getItem('logRetentionDays')) || 30,
    autoDelete: localStorage.getItem('logAutoDelete') === 'true'
  });
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    isAdmin: false,
    profileImage: null
  });

  /**
   * useEffect hook runs once on component mount to load user data and users list
   * from localStorage. If no user data is found, redirects to login page.
   * It also ensures only one "admin" user exists.
   */
  useEffect(() => {
    // Load current user data from localStorage
    const loadUserData = () => {
      const storedUserData = localStorage.getItem("currentUser");
      return storedUserData ? JSON.parse(storedUserData) : null;
    };

    // Load users list from localStorage
    const loadUsers = () => {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const usersObj = JSON.parse(storedUsers);
        return Object.values(usersObj); // Convert object of users to array
      }
      return [];
    };

    const userData = loadUserData();
    if (!userData) {
      navigate("/"); // Redirect to login if no user data is found
    } else {
      setUser(userData); // Set current user data
    }

    const loadedUsers = loadUsers();

    // Ensure that only one "admin" user exists in the list
    const adminCount = loadedUsers.filter(
      (u) => u.username.toLowerCase() === "admin"
    ).length;

    if (adminCount > 1) {
      // Filter out extra "admin" users, retaining only one
      const filteredUsers = loadedUsers.filter(
        (u) => u.username.toLowerCase() !== "admin"
      );
      const adminUser = loadedUsers.find(
        (u) => u.username.toLowerCase() === "admin"
      );
      const updatedUsers = adminUser
        ? [...filteredUsers, adminUser]
        : filteredUsers;

      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers)); // Save updated users to localStorage
    } else {
      setUsers(loadedUsers); // Set users state if no extra "admin" found
    }
  }, [navigate]); // Dependency array to re-run effect when navigate changes

  // Load custom sensors on component mount
  useEffect(() => {
    const stored = localStorage.getItem('customSensors');
    if (stored) {
      setCustomSensors(JSON.parse(stored));
    }
  }, []);

  /**
   * Function to notify users who are not admins
   */
  const notifyNonAdmin = () => {
    alert("Only admins can change settings.");
  };

  /**
   * Function to handle editing a user
   * @param {string} username - The username of the user to edit
   */
  const handleEditUser = (username) => {
    // Check if current user is an admin
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    // Prevent editing the default "admin" account
    if (username === "admin") {
      alert("You cannot edit the default admin account.");
      return;
    }

    // Find the user to be edited
    const userToEdit = users.find((user) => user.username === username);
    setEditingUser(userToEdit); // Set the user to be edited
    setNewUserName(userToEdit?.username || ""); // Set initial edit username
    setNewPassword(userToEdit?.password || ""); // Set initial edit password
  };

  /**
   * Object defining the requirements for a valid password
   */
  const passwordRequirements = {
    length: (password) => password.length >= 16,
    uppercase: (password) => /[A-Z]/.test(password),
    lowercase: (password) => /[a-z]/.test(password),
    number: (password) => /[0-9]/.test(password),
    specialChar: (password) => /[!@#$%^&*]/.test(password),
  };

  /**
   * Function to validate a password against defined requirements
   * @param {string} password - The password to validate
   * @returns {boolean} - Whether the password is valid
   */
  const validatePassword = (password) => ({
    length: password.length >= 16,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  });

  /**
   * Function to save changes made to a user's information
   */
const handleSaveUserEdit = async () => {
  if (!editingUser) return;

  const previousUsername = editingUser.username;

  // Log the change if the username is being edited
  if (newUserName !== previousUsername) {
    logEvent(
      `Username changed from "${previousUsername}" to "${newUserName}".`
    );
  }

  let passwordChanged = false; // Track if password is changed

  if (user.isAdmin && newPassword !== editingUser.password) {
    const isValidPassword = validatePassword(newPassword);
    if (!isValidPassword) {
      const confirmChange = window.confirm(
        "The new password does not meet the requirements. Do you want to proceed anyway?"
      );
      if (!confirmChange) return; // If admin cancels, do not proceed
    }

    passwordChanged = true; // Set flag indicating the password is being changed
  }

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

  // Log the password change
  if (passwordChanged) {
    logEvent(`Password changed for user: "${previousUsername}".`);
  }

  setEditingUser(null);
  setNewUserName("");
  setNewPassword("");
};

  /**
   * Function to delete a user
   * @param {string} username - The username of the user to delete
   */
  const handleDeleteUser = (username) => {
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    if (username === "admin") {
      alert("You cannot delete the default admin account.");
      return;
    }

    if (username === user.username) {
      alert("You cannot delete your own account.");
      return;
    }

    logEvent(`Deleted user: "${username}".`); // Log the deletion

    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter(
        (user) => user.username !== username
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  /**
   * Function to toggle the admin status of a user
   * @param {string} username - The username of the user whose admin status is to be toggled
   */
  const handleToggleAdmin = (username) => {
    if (!user || !user.isAdmin) {
      notifyNonAdmin();
      return;
    }

    if (username.toLowerCase() === "admin") {
      alert(
        "You cannot remove admin privileges from the default admin account."
      );
      return;
    }

    if (username === user.username) {
      alert("You cannot remove your own admin privileges.");
      return;
    }

    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.username.toLowerCase() === username.toLowerCase()) {
          const newIsAdminStatus = !user.isAdmin;
          logEvent(
            newIsAdminStatus
              ? `Made "${username}" an admin.`
              : `Removed "${username}" from admin.`
          ); // Log the admin status change
          return { ...user, isAdmin: newIsAdminStatus }; // Toggle admin status
        }
        return user;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  /**
   * Function to sign out the current user and redirect to the login page
   */
  const handleSignOut = () => {
    localStorage.removeItem("currentUser"); // Remove current user from localStorage
    navigate("/"); // Redirect to login page
  };

  // Log user actions for auditing purposes
  const logEvent = (action) => {
    const currentDateTime = new Date();
    const logEntry = {
      date: currentDateTime.toLocaleDateString(), // Get the date
      time: currentDateTime.toLocaleTimeString(), // Get the time
      user: user ? user.username : "Unknown User", // Get current user
      action: action, // The action taken
    };

    // Append the log entry to local storage
    const logs = JSON.parse(localStorage.getItem("logs")) || [];
    logs.push(logEntry);
    localStorage.setItem("logs", JSON.stringify(logs));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user is admin
    if (!user?.isAdmin) {
      alert("Only administrators can create sensors.");
      return;
    }
    
    // Create sensor ID from name
    const sensorId = newSensor.name.toLowerCase().replace(/\s+/g, '_');
    
    // Check for duplicate sensors (comparing all three fields)
    const isDuplicate = customSensors.some(sensor => 
      sensor.name.toLowerCase() === newSensor.name.toLowerCase() &&
      sensor.icon === (newSensor.icon || '🔔') &&
      sensor.description === newSensor.description
    );

    if (isDuplicate) {
      alert("A sensor with identical name, icon, and description already exists.");
      return;
    }
    
    const newCustomSensor = {
      id: sensorId,
      name: newSensor.name,
      icon: newSensor.icon || '🔔',
      description: newSensor.description,
      sensorKey: `${sensorId}Sensor`,
      alarmKey: `${sensorId}Alarm`
    };

    const updatedSensors = [...customSensors, newCustomSensor];
    setCustomSensors(updatedSensors);
    localStorage.setItem('customSensors', JSON.stringify(updatedSensors));

    // Initialize sensor and alarm states in localStorage
    const storedActivatedSensors = JSON.parse(localStorage.getItem('activatedSensors') || '{}');
    const storedActiveAlarms = JSON.parse(localStorage.getItem('activeAlarms') || '{}');
    const storedLastTriggeredTimes = JSON.parse(localStorage.getItem('lastTriggeredTimes') || '{}');

    storedActivatedSensors[newCustomSensor.sensorKey] = false;
    storedActiveAlarms[newCustomSensor.alarmKey] = false;
    storedLastTriggeredTimes[newCustomSensor.sensorKey] = 'Never';
    storedLastTriggeredTimes[newCustomSensor.alarmKey] = 'Never';

    localStorage.setItem('activatedSensors', JSON.stringify(storedActivatedSensors));
    localStorage.setItem('activeAlarms', JSON.stringify(storedActiveAlarms));
    localStorage.setItem('lastTriggeredTimes', JSON.stringify(storedLastTriggeredTimes));

    // Log the sensor creation
    logEvent(`Created new sensor: "${newSensor.name}"`);

    // Reset form
    setNewSensor({ name: '', icon: '', description: '' });
  };

  const deleteSensor = (sensorId) => {
    // Check if user is admin
    if (!user?.isAdmin) {
      alert("Only administrators can delete sensors.");
      return;
    }

    // Find the sensor to log its name
    const sensorToDelete = customSensors.find(sensor => sensor.id === sensorId);
    
    const updatedSensors = customSensors.filter(sensor => sensor.id !== sensorId);
    setCustomSensors(updatedSensors);
    localStorage.setItem('customSensors', JSON.stringify(updatedSensors));

    // Clean up related states in localStorage
    const storedActivatedSensors = JSON.parse(localStorage.getItem('activatedSensors') || '{}');
    const storedActiveAlarms = JSON.parse(localStorage.getItem('activeAlarms') || '{}');
    const storedLastTriggeredTimes = JSON.parse(localStorage.getItem('lastTriggeredTimes') || '{}');

    delete storedActivatedSensors[`${sensorId}Sensor`];
    delete storedActiveAlarms[`${sensorId}Alarm`];
    delete storedLastTriggeredTimes[`${sensorId}Sensor`];
    delete storedLastTriggeredTimes[`${sensorId}Alarm`];

    localStorage.setItem('activatedSensors', JSON.stringify(storedActivatedSensors));
    localStorage.setItem('activeAlarms', JSON.stringify(storedActiveAlarms));
    localStorage.setItem('lastTriggeredTimes', JSON.stringify(storedLastTriggeredTimes));

    // Log the sensor deletion
    logEvent(`Deleted sensor: "${sensorToDelete.name}"`);
  };

  const handleLogSettingsChange = (setting, value) => {
    if (!user?.isAdmin) {
      alert("Only administrators can modify log settings.");
      return;
    }

    setLogSettings(prev => {
      const newSettings = { ...prev, [setting]: value };
      
      // Save to localStorage
      if (setting === 'maxEntries') {
        localStorage.setItem('logMaxEntries', value);
      } else if (setting === 'retentionDays') {
        localStorage.setItem('logRetentionDays', value);
      } else if (setting === 'autoDelete') {
        localStorage.setItem('logAutoDelete', value);
      }

      // Log the change
      logEvent(`Modified log setting: ${setting} set to ${value}`);
      
      // Apply the settings
      applyLogSettings(newSettings);
      
      return newSettings;
    });
  };

  const applyLogSettings = (settings) => {
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
    let updatedLogs = [...logs];

    // Apply max entries limit
    if (settings.maxEntries > 0) {
      updatedLogs = updatedLogs.slice(-settings.maxEntries);
    }

    // Apply retention period if auto-delete is enabled
    if (settings.autoDelete) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - settings.retentionDays);
      
      updatedLogs = updatedLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate > cutoffDate;
      });
    }

    localStorage.setItem('logs', JSON.stringify(updatedLogs));
  };

  const clearLogs = () => {
    if (!user?.isAdmin) {
      alert("Only administrators can clear logs.");
      return;
    }

    if (window.confirm("Are you sure you want to clear all logs? This action cannot be undone.")) {
      localStorage.setItem('logs', JSON.stringify([]));
      logEvent("Cleared all logs");
    }
  };

  const exportLogs = () => {
    if (!user?.isAdmin) {
      alert("Only administrators can export logs.");
      return;
    }

    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
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

    logEvent("Exported logs to CSV");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!user?.isAdmin) {
      alert("Only administrators can create users.");
      return;
    }

    // Check for empty fields
    if (!newUser.username || !newUser.password) {
      alert("Username and password are required.");
      return;
    }

    // Check username length
    if (newUser.username.length < 5) {
      if (!window.confirm("Username is shorter than 5 characters. Create anyway?")) {
        return;
      }
    }

    // Check if username exists
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.some(u => u.username === newUser.username)) {
      alert("Username already exists.");
      return;
    }

    // Validate password and warn if weak
    const passwordRequirements = validatePassword(newUser.password);
    const isWeakPassword = !Object.values(passwordRequirements).every(Boolean);
    
    if (isWeakPassword) {
      const weaknesses = [];
      if (!passwordRequirements.length) weaknesses.push("- Less than 16 characters");
      if (!passwordRequirements.uppercase) weaknesses.push("- Missing uppercase letter");
      if (!passwordRequirements.lowercase) weaknesses.push("- Missing lowercase letter");
      if (!passwordRequirements.number) weaknesses.push("- Missing number");
      if (!passwordRequirements.specialChar) weaknesses.push("- Missing special character");

      const confirmMessage = `Warning: This password is weak:\n${weaknesses.join('\n')}\n\nCreate user anyway?`;
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const createdUser = {
      username: newUser.username,
      password: hashedPassword,
      isAdmin: newUser.isAdmin,
      profileImage: newUser.profileImage
    };

    // Add user to storage
    const updatedUsers = [...storedUsers, createdUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Log the creation with details
    console.log('Created new user:', {
      username: newUser.username,
      isAdmin: newUser.isAdmin,
      passwordStrength: isWeakPassword ? 'Weak' : 'Strong',
      weaknesses: isWeakPassword ? Object.entries(passwordRequirements)
        .filter(([_, valid]) => !valid)
        .map(([requirement]) => requirement) : []
    });

    // Log to admin logs
    logEvent(`Created new user "${newUser.username}"${newUser.isAdmin ? ' with admin privileges' : ''}`);

    // Reset form including image
    setNewUser({
      username: '',
      password: '',
      isAdmin: false,
      profileImage: null
    });

    alert("User created successfully!");
  };

  return (
    <div className="home-container">
      <Sidebar
        user={user}
        handleSignOut={handleSignOut}
        isCollapsed={isSidebarCollapsed}
      />
      <div className="content-wrapper">
        <main className="main-content">
          <h1 className="header-title">Settings</h1>
          
          {/* Add Custom Sensors Section */}
          <section className="custom-sensors-section">
            <h2>Create Custom Sensor</h2>
            {!user?.isAdmin ? (
              <p className="admin-only-message">Only administrators can create and manage sensors.</p>
            ) : (
              <form onSubmit={handleSubmit} className="sensor-form">
                <div className="form-group">
                  <label>Sensor Name:</label>
                  <input
                    type="text"
                    value={newSensor.name}
                    onChange={(e) => setNewSensor({...newSensor, name: e.target.value})}
                    required
                    placeholder="Enter sensor name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Icon (emoji or URL):</label>
                  <input
                    type="text"
                    value={newSensor.icon}
                    onChange={(e) => setNewSensor({...newSensor, icon: e.target.value})}
                    placeholder="🔔"
                  />
                </div>

                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={newSensor.description}
                    onChange={(e) => setNewSensor({...newSensor, description: e.target.value})}
                    placeholder="Describe the sensor's purpose"
                  />
                </div>

                <button type="submit" className="create-sensor-btn">
                  Create Sensor
                </button>
              </form>
            )}
          </section>

          <section className="existing-sensors-section">
            <h2>Existing Custom Sensors</h2>
            {!user?.isAdmin ? (
              <p className="admin-only-message">Only administrators can manage sensors.</p>
            ) : (
              customSensors.length === 0 ? (
                <p className="no-sensors-message">No custom sensors have been created yet.</p>
              ) : (
                <div className="sensors-grid">
                  {customSensors.map((sensor, index) => (
                    <div key={`settings-sensor-${sensor.id}-${index}`} className="sensor-item">
                      <div className="sensor-icon">{sensor.icon}</div>
                      <div className="sensor-info">
                        <h3>{sensor.name}</h3>
                        <p className="sensor-description">
                          {sensor.description || 'No description provided'}
                        </p>
                      </div>
                      <button 
                        onClick={() => deleteSensor(sensor.id)}
                        className="delete-sensor-btn"
                        title="Delete sensor"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}
          </section>

          <section className="create-user-section">
            <h2>Create New User</h2>
            {!user?.isAdmin ? (
              <p className="admin-only-message">Only administrators can create users.</p>
            ) : (
              <form onSubmit={handleCreateUser} className="create-user-form">
                <div className="profile-image-upload">
                  <div className="image-preview">
                    {newUser.profileImage ? (
                      <img 
                        src={newUser.profileImage} 
                        alt="Profile preview" 
                        className="profile-preview"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <span>👤</span>
                        <p>Upload Profile Image</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="profile-image"
                    className="image-input"
                  />
                  <label htmlFor="profile-image" className="upload-button">
                    Choose Image
                  </label>
                </div>

                <div className="user-form-fields">
                  <div className="form-group">
                    <label>Username:</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Password:</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newUser.isAdmin}
                        onChange={(e) => setNewUser({...newUser, isAdmin: e.target.checked})}
                      />
                      Create as Administrator
                    </label>
                  </div>

                  <button type="submit" className="create-user-btn">
                    Create User
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Existing Users Section */}
          <section className="users-section">
            <h2>Manage Users</h2>
            {!user?.isAdmin ? (
              <p className="admin-only-message">Only administrators can manage users.</p>
            ) : (
              <div className="users-list">
                {users.length === 0 ? (
                  <p>No users available.</p>
                ) : (
                  users.map((user) => (
                    <li className="user-item" key={user.username}>
                      <span>
                        {user.username} {user.isAdmin ? "(Admin)" : ""}
                      </span>
                      <div className="button-container">
                        <button
                          className="edit-user-button"
                          onClick={() => handleEditUser(user.username)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-user-button"
                          onClick={() => handleDeleteUser(user.username)}
                        >
                          Delete
                        </button>
                        <button
                          className="toggle-admin-button"
                          onClick={() => handleToggleAdmin(user.username)}
                        >
                          {user.isAdmin ? "Remove Admin" : "Make Admin"}
                        </button>
                      </div>
                      {editingUser?.username === user.username && (
                        <div className="edit-user-inputs">
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
                        </div>
                      )}
                    </li>
                  ))
                )}
              </div>
            )}
          </section>

          <section className="log-settings-section">
            <h2>Log Management</h2>
            {!user?.isAdmin ? (
              <p className="admin-only-message">Only administrators can manage logs.</p>
            ) : (
              <>
                <div className="log-settings-grid">
                  <div className="log-setting-item">
                    <label>Maximum Log Entries:</label>
                    <input
                      type="number"
                      min="0"
                      value={logSettings.maxEntries}
                      onChange={(e) => handleLogSettingsChange('maxEntries', parseInt(e.target.value))}
                      className="log-setting-input"
                    />
                    <p className="setting-description">
                      Set to 0 for unlimited entries
                    </p>
                  </div>

                  <div className="log-setting-item">
                    <label>Auto-Delete Logs:</label>
                    <div className="toggle-container">
                      <input
                        type="checkbox"
                        checked={logSettings.autoDelete}
                        onChange={(e) => handleLogSettingsChange('autoDelete', e.target.checked)}
                        className="toggle-input"
                      />
                      <span className="toggle-label">
                        {logSettings.autoDelete ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="log-setting-item">
                    <label>Retention Period (days):</label>
                    <input
                      type="number"
                      min="1"
                      value={logSettings.retentionDays}
                      onChange={(e) => handleLogSettingsChange('retentionDays', parseInt(e.target.value))}
                      className="log-setting-input"
                      disabled={!logSettings.autoDelete}
                    />
                  </div>
                </div>

                <div className="log-actions">
                  <button 
                    onClick={clearLogs}
                    className="clear-logs-btn"
                  >
                    Clear All Logs
                  </button>
                  <button 
                    onClick={exportLogs}
                    className="export-logs-btn"
                  >
                    Export Logs to CSV
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
