import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing
import "./styles/register.css";

// User class definition for creating new users
class User {
  constructor(username, password, isAdmin) {
    this.username = username;
    this.password = password; // This will now be the hashed password
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
 const handleSubmit = async (event) => {
   event.preventDefault();
   const newErrorMessages = [];

   // Validating the username length
   if (username.length < 5) {
     newErrorMessages.push("Username must be at least 5 characters long.");
   }

   // Retrieve the stored users and ensure it's an array
   const storedUsersString = localStorage.getItem("users");
   let storedUsers = [];

   // Parse stored users and handle errors
   try {
     if (storedUsersString) {
       storedUsers = JSON.parse(storedUsersString);
       // Ensure storedUsers is an array
       if (!Array.isArray(storedUsers)) {
         throw new Error("Stored users is not an array.");
       }
     }
   } catch (error) {
     console.error("Error retrieving users:", error);
     storedUsers = []; // Reset to an empty array if there's an error
   }

   // Count regular users (excluding admins)
   const regularUsersCount = storedUsers.filter((user) => !user.isAdmin).length;

   // Alert if max number of regular users is reached
   if (regularUsersCount >= 4) {
     alert("Maximum number of regular users (4) has been reached.");
     return; // Prevent further registration
   }

   // Checking if the username already exists in the stored users
   const userExists = storedUsers.find((user) => user.username === username);
   if (userExists) {
     newErrorMessages.push("Username already exists. Please choose another.");
   }

   // Password validation
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
   const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
   const newUser = new User(username, hashedPassword, false); // Store the hashed password
   storedUsers.push(newUser); // Add the new user to the array
   localStorage.setItem("users", JSON.stringify(storedUsers)); // Save the updated users array to localStorage

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

        {/* Display error messages if there are any */}
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
