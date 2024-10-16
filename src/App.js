import React, { useState } from "react"; // Importing React and useState for state management
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // Importing HashRouter, Route, and Routes for navigation
import "./App.css"; // Importing the main CSS file for styling
import Register from "./components/register.js"; // Importing the Register component
import Login from "./components/login.js"; // Importing the Login component
import HomePage from "./components/homepage"; // Importing the HomePage component

// Defining the main App component
function App() {
  // Using useState to track whether the Login page is currently being shown
  const [showLogin, setShowLogin] = useState(false); // Initially setting the state to false to show the Register page by default

  // Function to toggle between the Login and Register pages
  const togglePage = () => {
    // Updating the state to switch between true and false
    setShowLogin((prev) => !prev); // Using the previous state to determine the new state (toggle logic)
  };

  // Returning the main JSX layout for the App component
  return (
    <Router>
      {/* Wrapping the content in a Router for navigation */}
      <div className="App">
        {/* Defining the routes for the application */}
        <Routes>
          {/* Default route ("/") to either show the Login or Register component */}
          <Route
            path="/"
            element={
              showLogin ? (
                // If showLogin is true, render the Login component
                <Login togglePage={togglePage} />
              ) : (
                // If showLogin is false, render the Register component
                <Register togglePage={togglePage} />
              )
            }
          />
          {/* Route for the HomePage component */}
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Exporting the App component as the default export
