import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Login({ togglePage, showLogin }) {
  const navigate = useNavigate(); // Create a navigate function

  // Function to handle login
  const handleLogin = (event) => {
    event.preventDefault(); // Prevent form submission

    // Get the values from the input fields
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Validate input
    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    // Check stored users
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username] && users[username] === password) {
      alert("Login successful!");
      // Redirect to the HomePage after successful login
      navigate("/home"); // Adjust the path according to your route configuration
    } else {
      alert("Invalid username or password.");
    }
  };

  // Add event listener to the form when the component mounts
  useEffect(() => {
    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", handleLogin);
    }

    // Set up the default admin user if not already present
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users.admin) {
      users.admin = "password"; // Default admin credentials
      localStorage.setItem("users", JSON.stringify(users));
    }

    // Cleanup the event listener on component unmount
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

        {/* Button to switch between Login and Register */}
        <button className="toggle-button" onClick={togglePage}>
          {showLogin ? "Go to Register" : "Register?"}
        </button>
      </div>
    </div>
  );
}
