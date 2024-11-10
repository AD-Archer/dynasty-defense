import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./components/register";
import Login from "./components/login";
import HomePage from "./components/homepage";
import SettingsPage from "./components/SettingsPage";
import AdminLog from "./components/AdminLog";

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
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/AdminLog" element={<AdminLog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
