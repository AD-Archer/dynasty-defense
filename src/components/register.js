import React, { useState } from "react";

export default function Register({ togglePage, showLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    const newErrorMessages = [];

    // Validate username
    if (username.length < 5) {
      newErrorMessages.push("Username must be at least 5 characters long.");
    }

    // Check if username already exists
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      newErrorMessages.push("Username already exists. Please choose another.");
    }

    // Validate password
    const passwordRequirements = {
      length: password.length >= 16,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };

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

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrorMessages.push("Passwords do not match.");
    }

    // If there are error messages, set them and stop registration
    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    // If all validations pass, store credentials
    users[username] = password; // Store new user
    localStorage.setItem("users", JSON.stringify(users));

    // Clear error messages and show success message
    setErrorMessages([]);
    alert("Registration successful!");
  };

  return (
    <div className="container">
      <section className="header">
        <h1>Dynasty Defense Security</h1>
      </section>

      <div className="login-card">
        <h2>Register</h2>
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
