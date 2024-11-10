// Import necessary dependencies
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // For password hashing
import "./styles/register.css";

/**
 * User class
 *
 * Represents a user in the application, with properties for username, hashed password,
 * and a flag indicating if the user is an admin.
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's hashed password
 * @param {boolean} isAdmin - Indicates if the user has admin privileges (default: false)
 */
class User {
  constructor(username, password, isAdmin = false) {
    this.username = username;
    this.password = password; // This stores the hashed password
    this.isAdmin = isAdmin; // Admin flag (false for regular users)
  }
}

/**
 * Logs a registration event to the admin log
 *
 * @param {string} username - The username of the registered user
 * @param {string} action - Description of the action being logged
 */
const logRegistration = (action) => {
  const currentDateTime = new Date(); // Get the current date and time
  const logEntry = {
    date: currentDateTime.toLocaleDateString(), // Get the date
    time: currentDateTime.toLocaleTimeString(), // Get the time
    user: "no-user", // Use "no-user" as the username
    action: action, // The action taken
  };

  // Retrieve the existing admin log from localStorage
  const logEntriesString = localStorage.getItem("adminLog");
  let logEntries = [];

  // Parse existing log entries or initialize an empty array
  try {
    if (logEntriesString) {
      logEntries = JSON.parse(logEntriesString) || [];
      if (!Array.isArray(logEntries)) {
        throw new Error("Log entries are not an array.");
      }
    }
  } catch (error) {
    console.error("Error retrieving admin log:", error);
    logEntries = []; // Reset to an empty array if there's an error
  }

  // Add the new log entry and save back to localStorage
  logEntries.push(logEntry);
  localStorage.setItem("adminLog", JSON.stringify(logEntries));

  // Debugging: Output the updated admin log entries to the console
  console.log("Updated Admin Log Entries:", logEntries);
};

/**
 * Register Component
 *
 * This component allows users to register an account with username and password.
 * It performs validations, hashes the password, and logs the registration.
 *
 * @param {Object} props - Component properties
 * @param {Function} props.togglePage - Function to toggle between login and register views
 * @param {boolean} props.showLogin - Indicates whether to show the login page
 * @returns {JSX.Element} The Register component
 */
export default function Register({ togglePage, showLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  /**
   * Validates password requirements
   *
   * @param {string} password - The password to validate
   * @returns {Object} An object indicating which requirements are met
   */
  const validatePassword = (password) => ({
    length: password.length >= 16,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  });

  /**
   * Handles form submission for registration
   *
   * Validates user input, hashes the password, creates a new user, and navigates to the homepage.
   *
   * @param {Event} event - The form submission event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrorMessages = [];

    // Validate username length
    if (username.length < 5) {
      newErrorMessages.push("Username must be at least 5 characters long.");
    }

    // Retrieve and parse stored users
    const storedUsersString = localStorage.getItem("users");
    let storedUsers = [];
    try {
      if (storedUsersString) {
        storedUsers = JSON.parse(storedUsersString) || [];
        if (!Array.isArray(storedUsers)) {
          throw new Error("Stored users is not an array.");
        }
      }
    } catch (error) {
      console.error("Error retrieving users:", error);
      storedUsers = []; // Reset to an empty array if there's an error
    }

    // Count regular users and check the maximum limit
    const regularUsersCount = storedUsers.filter(
      (user) => !user.isAdmin
    ).length;
    if (regularUsersCount >= 10) {
      alert("Maximum number of regular users (10) has been reached.");
      return;
    }

    // Check for existing username
    const userExists = storedUsers.some((user) => user.username === username);
    if (userExists) {
      newErrorMessages.push("Username already exists. Please choose another.");
    }

    // Validate password
    const passwordRequirements = validatePassword(password);
    if (!passwordRequirements.length) {
      newErrorMessages.push("Password must be at least 16 characters long.");
    }
    if (!passwordRequirements.uppercase) {
      newErrorMessages.push(
        "Password must contain at least one uppercase letter."
      );
    }
    if (!passwordRequirements.lowercase) {
      newErrorMessages.push(
        "Password must contain at least one lowercase letter."
      );
    }
    if (!passwordRequirements.number) {
      newErrorMessages.push("Password must contain at least one number.");
    }
    if (!passwordRequirements.specialChar) {
      newErrorMessages.push(
        "Password must contain at least one special character."
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      newErrorMessages.push("Passwords do not match.");
    }

    // If there are validation errors, update the state and exit
    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(username, hashedPassword);
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    // Log the registration in a consistent format
    logRegistration(username, `Registered a new user`);

    // Automatically log in the new user
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // Clear error messages and navigate to the homepage
    setErrorMessages([]);
    alert("Registration successful!");
    navigate("/home");
  };

  return (
    <div className="container">
      <section className="header">
        <h1>Dynasty Defense Security</h1>
      </section>

      <div className="login-card">
        <h2>Register Guest</h2>
        <form
          id="registration-form"
          className="sign-in-form"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <input
              type="text"
              id="new-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
            />
          </div>
          <button type="submit">Register</button>
        </form>
        {errorMessages.length > 0 && (
          <div className="error-messages">
            {errorMessages.map((msg, index) => (
              <p key={index} className="error">
                {msg}
              </p>
            ))}
          </div>
        )}
        <button className="toggle-button" onClick={togglePage}>
          {showLogin ? "Go to Register" : "Login?"}
        </button>
      </div>
    </div>
  );
}
