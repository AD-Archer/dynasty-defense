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
    return users ? users : {};
  });

  useEffect(() => {
    // Create admin user if it doesn't exist
    if (!storedUsers.admin) {
      const adminUser = new User("admin", "password", true);
      storedUsers.admin = {
        username: adminUser.username,
        password: adminUser.password,
        isAdmin: adminUser.isAdmin,
      };
      localStorage.setItem("users", JSON.stringify(storedUsers));
      setStoredUsers(storedUsers); // Update state to trigger re-render
    }
  }, [storedUsers]);

  const handleLogin = (event) => {
    event.preventDefault();

    // Check if fields are filled
    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    // Attempt to retrieve the user based on the provided username
    const user = storedUsers[username];

    // Validate user existence and password
    if (user && user.password.toLowerCase() === password.toLowerCase()) {
      alert("Login successful!");
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/home");
    } else {
      alert("Invalid username or password."); // Password mismatch
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
