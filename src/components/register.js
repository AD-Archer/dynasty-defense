import React, { useState } from "react"; // Importing React and useState for managing state

// The Register component definition
export default function Register({ togglePage, showLogin }) {
  // State variables for form inputs and error messages
  const [username, setUsername] = useState(""); // State to hold the input for the username
  const [password, setPassword] = useState(""); // State to hold the input for the password
  const [confirmPassword, setConfirmPassword] = useState(""); // State to hold the input for password confirmation
  const [errorMessages, setErrorMessages] = useState([]); // State to hold error messages for form validation

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Preventing the form from submitting and refreshing the page
    const newErrorMessages = []; // Initializing an array to collect new error messages

    // Validating the username length
    if (username.length < 5) {
      newErrorMessages.push("Username must be at least 5 characters long."); // Adding an error message if username is too short
    }

    // Checking if the username already exists in the stored users
    const users = JSON.parse(localStorage.getItem("users")) || {}; // Retrieving stored users or initializing an empty object if none found
    if (users[username]) {
      newErrorMessages.push("Username already exists. Please choose another."); // Adding an error message if username is already taken
    }

    // Defining password requirements for validation
    const passwordRequirements = {
      length: password.length >= 16, // Checking if the password is at least 16 characters long
      uppercase: /[A-Z]/.test(password), // Checking if the password contains at least one uppercase letter
      lowercase: /[a-z]/.test(password), // Checking if the password contains at least one lowercase letter
      number: /[0-9]/.test(password), // Checking if the password contains at least one number
      specialChar: /[!@#$%^&*]/.test(password), // Checking if the password contains at least one special character
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
      newErrorMessages.push("Passwords do not match."); // Adding an error message if passwords do not match
    }

    // Checking if there are any validation errors
    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages); // If there are errors, update the state with the error messages
      return; // Stop further execution if there are errors
    }

    // If all validations pass, proceed to register the new user
    users[username] = password; // Adding the new user to the stored users
    localStorage.setItem("users", JSON.stringify(users)); // Saving the updated users to localStorage

    // Clearing error messages after a successful registration
    setErrorMessages([]);
    alert("Registration successful!"); // Displaying a success message
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
