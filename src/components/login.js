import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

class User {
  constructor(username, password, isAdmin) {
    this.username = username;
    this.password = password; // Ideally, this should be hashed
    this.isAdmin = isAdmin;
  }
}

export default function Login({ togglePage, showLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storedUsers, setStoredUsers] = useState(() => {
    const users = JSON.parse(localStorage.getItem("users"));
    return users || {}; // Return an empty object if none found
  });

  useEffect(() => {
    // Check if admin user exists in the storedUsers object
    if (!storedUsers["admin"]) {
      const adminUser = new User("admin", "password", true);
      const updatedUsers = { ...storedUsers, [adminUser.username]: adminUser };
      localStorage.setItem("users", JSON.stringify(updatedUsers)); // Save the updated object
      setStoredUsers(updatedUsers); // Update state to trigger re-render
      console.log("Admin user initialized:", updatedUsers);
    }
  }, [storedUsers]);

  const handleLogin = (event) => {
    event.preventDefault();

    // Check if fields are filled
    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    // Log the stored users for debugging
    console.log("Stored Users Object:", storedUsers);

    // Find the user in the storedUsers object
    const user = storedUsers[username.trim().toLowerCase()]; // Adjust for case sensitivity

    // Check if user is found
    if (!user) {
      alert("User not found. Please check the username.");
      console.log("No matching user found for username:", username);
      return;
    }

    // Log the found user and password entered for debugging
    console.log("User Found:", user);
    console.log("Entered Password:", password);

    // Validate password
    if (user.password === password.trim()) {
      alert("Login successful!");
      localStorage.setItem("currentUser", JSON.stringify(user)); // Store the current user
      navigate("/home");
    } else {
      alert("Invalid username or password."); // Password mismatch
      console.log("Password mismatch for user:", username);
    }
  };

  return (
    <div className="container">
      <section className="header">
        <h1>Dynasty Defense Security</h1>
      </section>
      <div className="login-card">
        <h2>Login</h2>
        <form id="login-form" className="sign-in-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
