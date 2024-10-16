import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Defining the User class with properties for username, password, and admin status
class User {
  constructor(username, password, isAdmin = false) {
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}

// Login component
export default function Login({ togglePage, showLogin }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); // State to hold current user

  // Function to handle the login process
  const handleLogin = (event) => {
    event.preventDefault();

    // Getting input values
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    console.log("Input Username:", username);
    console.log("Input Password:", password);

    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    // Retrieve stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    console.log("Stored Users:", storedUsers);

    // Check if the user exists and the password matches
    const user = storedUsers[username];
    console.log("Retrieved User:", user);

    if (user && user.password === password) {
      alert("Login successful!");

      // Set the current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      console.log("Current User Set:", user);

      // Update currentUser state
      setCurrentUser(user);

      // Navigate to the home page
      navigate("/home");
    } else {
      alert("Invalid username or password.");
      console.log("Login Failed: Username or password is incorrect.");
    }
  };

  useEffect(() => {
    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", handleLogin);
    }

    // Initialize a default admin user if not present
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    if (!storedUsers.admin) {
      const adminUser = new User("admin", "password", true); // Default admin user
      storedUsers.admin = {
        username: adminUser.username,
        password: adminUser.password,
        isAdmin: adminUser.isAdmin,
      };
      localStorage.setItem("users", JSON.stringify(storedUsers));
      console.log("Admin User Added:", storedUsers.admin);
    } else {
      console.log("Admin User Already Exists:", storedUsers.admin);
    }

    return () => {
      if (form) {
        form.removeEventListener("submit", handleLogin);
      }
    };
  }, []);

  // Pass current user to the homepage after login
  useEffect(() => {
    if (currentUser) {
      // Store the current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      // This effect can trigger a redirect to the homepage if necessary
      navigate("/home", { state: { currentUser } }); // Pass user state to home
    }
  }, [currentUser, navigate]);

  return (
    <div className="container">
      <section className="header">
        <h1>Dynasty Defense Security</h1>
      </section>
      <div className="login-card">
        <h2>Login</h2>
        <form id="login-form" className="sign-in-form">
          <div className="input-group">
            <input type="text" id="username" required placeholder="Username" />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              required
              placeholder="Password"
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <button className="toggle-button" onClick={togglePage}>
          {showLogin ? "Go to Register" : "Register?"}
        </button>
      </div>
    </div>
  );
}
