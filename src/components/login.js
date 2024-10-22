import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcryptjs

class User {
  constructor(username, password, isAdmin) {
    this.username = username.toLowerCase(); // Ensure usernames are stored in lowercase
    this.password = password; // Ideally, this should be hashed
    this.isAdmin = isAdmin;
  }
}

export default function Login({ togglePage, showLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storedUsers, setStoredUsers] = useState(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    return users;
  });

  useEffect(() => {
    if (!storedUsers["admin"]) {
      const adminUser = new User(
        "admin",
        bcrypt.hashSync("password", 10),
        true
      ); // Hash the admin password
      const updatedUsers = { ...storedUsers, admin: adminUser };
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setStoredUsers(updatedUsers);
    }
  }, [storedUsers]);

  const handleLogin = (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }

    const normalizedUsername = username.trim().toLowerCase(); // Normalize for consistency
    const storedUserList = Object.values(storedUsers); // Get an array of all user objects

    // Find the user by matching the username (case-insensitively) in the stored users
    const user = storedUserList.find(
      (u) => u.username.toLowerCase() === normalizedUsername
    );

    if (!user) {
      alert("User not found. Please check your username.");
      return;
    }

    // Compare the hashed password with the entered password
    if (bcrypt.compareSync(password.trim(), user.password)) {
      alert("Login successful!");
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/home");
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleCreateUser = (newUser) => {
    const normalizedUsername = newUser.username.trim().toLowerCase();

    if (storedUsers[normalizedUsername]) {
      alert("User already exists. Please choose a different username.");
      return;
    }

    // Hash the new user's password before storing
    const hashedPassword = bcrypt.hashSync(newUser.password, 10);
    const updatedUsers = {
      ...storedUsers,
      [normalizedUsername]: new User(
        normalizedUsername,
        hashedPassword,
        newUser.isAdmin
      ),
    };
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setStoredUsers(updatedUsers);
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
