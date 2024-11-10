import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./components/register";
import Login from "./components/login";
import HomePage from "./components/homepage";
import SettingsPage from "./components/SettingsPage";
import AdminLog from "./components/AdminLog";
import LandingPage from './components/LandingPage';
import LearnMore from './components/LearnMore';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/AdminLog" element={<AdminLog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
