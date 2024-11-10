// login.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing
import "./styles/global.css"; // Import global CSS styles

// User class for creating user objects
class User {
  constructor(username, password, isAdmin) {
    this.username = username.toLowerCase(); // Ensure usernames are stored in lowercase
    this.password = password; // Store the password (ideally hashed)
    this.isAdmin = isAdmin; // Boolean indicating if the user has admin privileges
  }
}

export default function Login({ togglePage, showLogin }) {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [username, setUsername] = useState(""); // State for storing the entered username
  const [password, setPassword] = useState(""); // State for storing the entered password
  const [storedUsers, setStoredUsers] = useState(() => {
    // Retrieve stored users from localStorage, or initialize as an empty object
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users;
  });

  useEffect(() => {
    // Check if an admin user exists, and create one if not
    if (!storedUsers["admin"]) {
      const adminUser = new User(
        "admin",
        bcrypt.hashSync("password", 10),
        true
      ); // Hash the admin password
      const updatedUsers = { ...storedUsers, admin: adminUser };
      localStorage.setItem("users", JSON.stringify(updatedUsers)); // Save updated users to localStorage
      setStoredUsers(updatedUsers); // Update state
    }
  }, [storedUsers]); // Dependency array to re-run effect when storedUsers changes

  // Handle login form submission
  const handleLogin = (event) => {
    event.preventDefault(); // Prevent form submission

    // Check if both username and password are provided
    if (!username || !password) {
      alert("Please fill in both username and password.");
      logAttempt(username, "Empty username or password"); // Log empty attempt
      return;
    }

    const normalizedUsername = username.trim().toLowerCase(); // Normalize for consistency
    const storedUserList = Object.values(storedUsers); // Get an array of all user objects

    // Find the user by matching the username (case-insensitively) in the stored users
    const user = storedUserList.find(
      (u) => u.username.toLowerCase() === normalizedUsername
    );

    // Log the username input and the outcome if user is not found
    if (!user) {
      alert("User not found. Please check your username.");
      logAttempt(normalizedUsername, "User not found"); // Log not found attempt
      return;
    }

    // Compare the hashed password with the entered password
    if (bcrypt.compareSync(password.trim(), user.password)) {
      alert("Login successful!"); // Success message
      localStorage.setItem("currentUser", JSON.stringify(user)); // Store current user in localStorage
      logAttempt(normalizedUsername, "Sign in: Login successful"); // Log successful login
      navigate("/home"); // Redirect to home page
    } else {
      alert("Invalid username or password."); // Error message
      logAttempt(normalizedUsername, "Sign in: Invalid password"); // Log invalid password attempt
    }
  };

  // Function to log login attempts
  const logAttempt = (username, action) => {
    const date = new Date();
    const logEntry = {
      date: date.toLocaleDateString(), // Log the current date
      time: date.toLocaleTimeString(), // Log the current time
      user: username, // Username attempting login
      action: action, // Outcome of the attempt
    };

    // Get existing logs from localStorage
    const existingLogs = JSON.parse(localStorage.getItem("logs")) || [];
    existingLogs.push(logEntry); // Add the new log entry
    localStorage.setItem("logs", JSON.stringify(existingLogs)); // Save logs back to localStorage
  };

  // Function to handle user creation
  const handleCreateUser = (newUser) => {
    const normalizedUsername = newUser.username.trim().toLowerCase(); // Normalize username

    // Check if user already exists
    if (storedUsers[normalizedUsername]) {
      alert("User already exists. Please choose a different username."); // Error if username is taken
      return;
    }

    // Hash the new user's password before storing
    const hashedPassword = bcrypt.hashSync(newUser.password, 10);
    const updatedUsers = {
      ...storedUsers,
      [normalizedUsername]: new User(
        normalizedUsername,
        hashedPassword,
        newUser.isAdmin // Set isAdmin based on newUser's properties
      ),
    };
    localStorage.setItem("users", JSON.stringify(updatedUsers)); // Save updated users to localStorage
    setStoredUsers(updatedUsers); // Update state
  };

  return (
    <div className="container">
      <section className="header">
        <h1>Dynasty Defense Security</h1> {/* Header for the login page */}
      </section>
      <div className="login-card">
        <h2>Login</h2> {/* Login form title */}
        <form id="login-form" className="sign-in-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state on input change
              required
              placeholder="Username" // Placeholder for username input
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state on input change
              required
              placeholder="Password" // Placeholder for password input
            />
          </div>
          <button type="submit">Login</button> {/* Submit button for login */}
        </form>
        <button className="toggle-button" onClick={togglePage}>
          {showLogin ? "Go to Register" : "Register?"}{" "}
          {/* Toggle to registration page */}
        </button>
      </div>
    </div>
  );
}
