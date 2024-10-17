import React, { useState } from "react"; // Importing React and useState for state management
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // Importing HashRouter, Route, and Routes for navigation
import "./App.css"; // Importing the main CSS file for styling
import Register from "./components/register"; // Importing the Register component
import Login from "./components/login"; // Importing the Login component
import HomePage from "./components/homepage"; // Importing the HomePage component
import SettingsPage from "./components/SettingsPage"; // Adjust the import path

// Defining the main App component
function App() {
  // Using useState to track whether the Login page is currently being shown
  const [showLogin, setShowLogin] = useState(false); // Initially showing the Register page by default

  // Function to toggle between the Login and Register pages
  const togglePage = () => {
    setShowLogin((prev) => !prev); // Toggle logic
  };

  // Returning the main JSX layout for the App component
  return (
    <Router>
      <div className="App">
        {/* Defining the routes for the application */}
        <Routes>
          <Route
            path="/"
            element={
              showLogin ? (
                <Login togglePage={togglePage} />
              ) : (
                <Register togglePage={togglePage} />
              )
            }
          />
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Exporting the App component
