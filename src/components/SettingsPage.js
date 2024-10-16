import React, { useState } from "react";
import "./styles/homepage.css"; // Assuming similar styles for now

export default function SettingsPage({ currentUser }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Example state for settings, such as notification preferences
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    theme: "light",
  });

  // Toggle the sidebar between collapsed and expanded
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Handle setting changes
  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  // This is the main render function for the settings page
  return (
    <div className="home-container">
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <button className="sidebar-button" onClick={toggleSidebar}>
          {isSidebarCollapsed ? "Expand" : "Collapse"}
        </button>
        <button className="sidebar-button">Sensors</button>
        <button className="sidebar-button">Alarms</button>
        <button className="sidebar-button settings-button active">
          Settings
        </button>
      </aside>

      <main className="main-content">
        <h1 className="header-title">Settings</h1>

        <section className="settings-section">
          <h2>Notification Settings</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() =>
                  handleSettingChange(
                    "emailNotifications",
                    !settings.emailNotifications
                  )
                }
              />
              Email Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={() =>
                  handleSettingChange(
                    "smsNotifications",
                    !settings.smsNotifications
                  )
                }
              />
              SMS Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange("theme", e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </section>
      </main>
    </div>
  );
}
