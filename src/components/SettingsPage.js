// settingspage.js

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import "./styles/homepage.css"; // Import homepage styles
import "./styles/settingspage.css"; // Import settings page styles
import Sidebar from "./SideBar"; // Import Sidebar component

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
  const validatePassword = (password) => {
    return (
      passwordRequirements.length(password) &&
      passwordRequirements.uppercase(password) &&
      passwordRequirements.lowercase(password) &&
      passwordRequirements.number(password) &&
      passwordRequirements.specialChar(password)
    );
  };

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

  return (
    <div className="home-container">
      <Sidebar
        user={user}
        handleSignOut={handleSignOut}
        isCollapsed={isSidebarCollapsed}
      />

      <main className="main-content">
        <h1 className="header-title">Settings</h1> {/* Page title */}
        <section className="users-section">
          <h2>Manage Users</h2> {/* Section title */}
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
        </section>
      </main>
    </div>
  );
}
