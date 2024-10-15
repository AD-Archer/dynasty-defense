import React, { useState } from "react";
import "./styles/homepage.css";

// Import your custom SVG icons
import flameIcon from "../assets/images/Flame icon.svg";
import securitySafeIcon from "../assets/images/Security Safe Icon.svg";
import smokeIcon from "../assets/images/Smoke icon.svg";

export default function HomePage({ currentUser }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lastTriggeredTimes, setLastTriggeredTimes] = useState({
    fireSensor: "Never",
    smokeSensor: "Never",
    securitySensor: "Never",
    fireAlarm: "Never",
    smokeAlarm: "Never",
    securityAlarm: "Never",
  });

  const [activeAlarms, setActiveAlarms] = useState({
    fireAlarm: false,
    smokeAlarm: false,
    securityAlarm: false,
  });

  const [activatedSensors, setActivatedSensors] = useState({
    fireSensor: false,
    smokeSensor: false,
    securitySensor: false,
  });

  // Toggle sidebar collapse
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Function to randomly trigger an alarm
  const randomTriggerAlarm = (sensor) => {
    if (Math.random() < 0.5) {
      const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
      const currentTime = new Date().toLocaleTimeString();
      setLastTriggeredTimes((prev) => ({ ...prev, [alarmKey]: currentTime }));
      setActiveAlarms((prev) => ({ ...prev, [alarmKey]: true }));
    }
  };

  // Trigger or deactivate a sensor
  const toggleSensor = (sensor) => {
    const currentTime = new Date().toLocaleTimeString();
    setActivatedSensors((prev) => {
      const newState = { ...prev, [sensor]: !prev[sensor] };
      setLastTriggeredTimes((prev) => ({
        ...prev,
        [sensor]: currentTime,
      }));
      if (newState[sensor]) randomTriggerAlarm(sensor);
      else {
        const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
        setActiveAlarms((prev) => ({ ...prev, [alarmKey]: false }));
      }
      return newState;
    });
  };

  // Silence an alarm if the user is admin
  const silenceAlarm = (alarm) => {
    if (currentUser && currentUser.toLowerCase() === "admin") {
      setActiveAlarms((prev) => ({ ...prev, [alarm]: false }));
      alert(`${alarm} silenced by admin.`);
    } else {
      alert(
        "You do not have permission to silence alarms. Only the admin can perform this action."
      );
    }
  };

  // Helper function to render sensor cards
  const renderSensorCard = (sensor, icon) => (
    <div className="sensor-card" key={sensor}>
      <img src={icon} alt={`${sensor} Icon`} className="sensor-icon" />
      <button
        className="alarm-button"
        style={{ backgroundColor: activatedSensors[sensor] ? "green" : "blue" }}
        onClick={() => toggleSensor(sensor)}
      >
        {activatedSensors[sensor] ? "Deactivate" : "Activate"}
      </button>
      {!isSidebarCollapsed && (
        <p className="last-triggered-text">
          Last Triggered: {lastTriggeredTimes[sensor]}
        </p>
      )}
    </div>
  );

  // Helper function to render alarm cards
  const renderAlarmCard = (alarm, icon) => (
    <div className="alarm-card" key={alarm}>
      <img src={icon} alt={`${alarm} Icon`} className="alarm-icon" />
      <button
        className="alarm-button"
        style={{ backgroundColor: activeAlarms[alarm] ? "red" : "blue" }}
        onClick={() => silenceAlarm(alarm)}
      >
        Silence Alarm
      </button>
      {!isSidebarCollapsed && (
        <p className="last-triggered-text">
          Last Triggered: {lastTriggeredTimes[alarm]}
        </p>
      )}
    </div>
  );

  return (
    <div className="home-container">
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <button className="sidebar-button" onClick={toggleSidebar}>
          {isSidebarCollapsed ? "Expand" : "Collapse"}
        </button>
        <button className="sidebar-button">Sensors</button>
        <button className="sidebar-button">Alarms</button>
        <button className="sidebar-button settings-button">Settings</button>
      </aside>

      <main className="main-content">
        <h1 className="header-title">Defense Panel</h1>

        <section className="sensors-section">
          <h2>Sensors</h2>
          <div className="sensor-cards-container">
            {renderSensorCard("fireSensor", flameIcon)}
            {renderSensorCard("smokeSensor", smokeIcon)}
            {renderSensorCard("securitySensor", securitySafeIcon)}
          </div>
        </section>

        <section className="alarms-section">
          <h2>Alarms</h2>
          <div className="alarm-cards-container">
            {renderAlarmCard("fireAlarm", flameIcon)}
            {renderAlarmCard("smokeAlarm", smokeIcon)}
            {renderAlarmCard("securityAlarm", securitySafeIcon)}
          </div>
        </section>
      </main>
    </div>
  );
}
