import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./components/register.js";
import Login from "./components/login.js";
import HomePage from "./components/homepage";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const togglePage = () => {
    setShowLogin((prev) => !prev);
  };

  return (
    <Router>
      <div className="App">
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
