import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

// User class definition for creating new users
class User {
  constructor(username, password, isAdmin) {
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin; // Set to false for regular users
  }
}

// The Register component definition
export default function Register({ togglePage, showLogin }) {
  // State variables for form inputs and error messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrorMessages = [];

    // Validating the username length
    if (username.length < 5) {
      newErrorMessages.push("Username must be at least 5 characters long.");
    }

    // Checking if the username already exists in the stored users
    const users = JSON.parse(localStorage.getItem("users")) || []; // Initialize as an array
    const userExists = users.find((user) => user.username === username);
    if (userExists) {
      newErrorMessages.push("Username already exists. Please choose another.");
    }

    // Password validation (same as before)
    const passwordRequirements = {
      length: password.length >= 16,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };

    // Adding error messages for password requirements that aren't met
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

    // Validating that the password and confirm password fields match
    if (password !== confirmPassword) {
      newErrorMessages.push("Passwords do not match.");
    }

    // Checking if there are any validation errors
    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    // If all validations pass, proceed to register the new user
    const newUser = new User(username, password, false);
    users.push(newUser); // Add the new user to the array
    localStorage.setItem("users", JSON.stringify(users)); // Save the updated users array to localStorage

    // Automatically log in the user by saving the username to localStorage
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // Clearing error messages after a successful registration
    setErrorMessages([]);
    alert("Registration successful!");

    // Navigate to the homepage
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

        {/* Display error messages */}
        {errorMessages.length > 0 && (
          <div className="error-messages">
            {errorMessages.map((message, index) => (
              <p key={index} className="error">
                {message}
              </p>
            ))}
          </div>
        )}

        {/* Button to switch between Register and Login */}
        <button className="toggle-button" onClick={togglePage}>
          {showLogin ? "Go to Register" : "Go to Login"}
        </button>
      </div>
    </div>
  );
}
