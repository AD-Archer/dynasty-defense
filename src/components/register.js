import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing
import "./styles/register.css";

// User class definition for creating new users
class User {
  constructor(username, password, isAdmin = false) {
    this.username = username;
    this.password = password; // This will be the hashed password
    this.isAdmin = isAdmin; // Set to false for regular users
  }
}

// Function to log the registration event
const logRegistration = (username, action) => {
  const logEntry = {
    action: action,
    user: username,
    timestamp: new Date().toISOString(), // Get current time in ISO format
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

  // Debugging: Log the entries to console
  console.log("Updated Admin Log Entries:", logEntries);
};

// The Register component definition
export default function Register({ togglePage, showLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  // Function to validate password requirements
  const validatePassword = (password) => ({
    length: password.length >= 16,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  });

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrorMessages = [];

    // Validating the username length
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

    // Count regular users (excluding admins)
    const regularUsersCount = storedUsers.filter(
      (user) => !user.isAdmin
    ).length;

    // Alert if max number of regular users is reached
    if (regularUsersCount >= 10) {
      alert("Maximum number of regular users (4) has been reached.");
      return; // Prevent further registration
    }

    // Checking if the username already exists
    const userExists = storedUsers.some((user) => user.username === username);
    if (userExists) {
      newErrorMessages.push("Username already exists. Please choose another.");
    }

    // Password validation
    const passwordRequirements = validatePassword(password);

    // Adding error messages for unmet password requirements
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

    // Validate that passwords match
    if (password !== confirmPassword) {
      newErrorMessages.push("Passwords do not match.");
    }

    // Set error messages if there are any validation issues
    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(username, hashedPassword); // Store the hashed password
    storedUsers.push(newUser); // Add the new user to the array
    localStorage.setItem("users", JSON.stringify(storedUsers)); // Save updated users array

    // Log the registration event
    logRegistration(username, "User Registration");

    // Automatically log in the user
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
