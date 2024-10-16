import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

class User {
  constructor(username, password, isAdmin) {
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}

export default function Login({ togglePage, showLogin }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (event) => {
    event.preventDefault();

    // Retrieve values from input fields
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Check if fields are filled
    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    // Retrieve stored users
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    console.log("Stored Users:", storedUsers); // Debugging line

    // Attempt to retrieve the user based on the provided username
    const user = storedUsers[username];
    console.log("Attempting login for:", username); // Debugging line

    // Validate user existence and password
    if (user) {
      console.log("Found user:", user); // Debugging line
      if (user.password.toLowerCase() === password.toLowerCase()) {
        alert("Login successful!");
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/home");
      } else {
        alert("Invalid username or password.");
      }
    } else {
      alert("Invalid username or password."); // Inform user the username doesn't exist
    }
  };

  // Set up the login form and create an admin user if none exists
  useEffect(() => {
    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", handleLogin);
    }

    // Ensure admin user is created if none exist
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    if (!storedUsers.admin) {
      const adminUser = new User("admin", "password", true);
      storedUsers.admin = {
        username: adminUser.username,
        password: adminUser.password,
        isAdmin: adminUser.isAdmin,
      };
      localStorage.setItem("users", JSON.stringify(storedUsers));
      console.log("Admin user created:", adminUser); // Debugging line
    }

    // Cleanup event listener on component unmount
    return () => {
      if (form) {
        form.removeEventListener("submit", handleLogin);
      }
    };
  }, []);

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
