import React, { useState } from "react";
import "./styles/homepage.css";

// Import your custom SVG icons
import flameIcon from "../assets/images/Flame icon.svg";
import securitySafeIcon from "../assets/images/Security Safe Icon.svg";
import smokeIcon from "../assets/images/Smoke icon.svg";

export default function HomePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Sample data for last triggered times
  const [lastTriggeredTimes, setLastTriggeredTimes] = useState({
    fireSensor: "Never",
    smokeSensor: "Never",
    securitySensor: "Never",
    fireAlarm: "Never",
    smokeAlarm: "Never",
    securityAlarm: "Never",
  });

  // State to track if alarms are active
  const [activeAlarms, setActiveAlarms] = useState({
    fireAlarm: false,
    smokeAlarm: false,
    securityAlarm: false,
  });

  // State to track if sensors are activated
  const [activatedSensors, setActivatedSensors] = useState({
    fireSensor: false,
    smokeSensor: false,
    securitySensor: false,
  });

  // Function to trigger alarms randomly
  const randomTriggerAlarm = (sensor) => {
    const shouldTrigger = Math.random() < 0.5; // 50% chance to trigger alarm

    if (shouldTrigger) {
      const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
      const currentTime = new Date().toLocaleTimeString();
      setLastTriggeredTimes((prev) => ({
        ...prev,
        [alarmKey]: currentTime,
      }));
      setActiveAlarms((prev) => ({ ...prev, [alarmKey]: true }));
    }
  };

  // Sample function to update last triggered time and check for alarms
  const triggerAlarm = (sensor) => {
    const currentTime = new Date().toLocaleTimeString();
    setLastTriggeredTimes((prev) => ({
      ...prev,
      [sensor]: currentTime,
    }));

    // Toggle the activation state of the sensor
    setActivatedSensors((prev) => {
      const newState = { ...prev, [sensor]: !prev[sensor] }; // Toggle activation
      if (newState[sensor]) {
        randomTriggerAlarm(sensor); // Trigger alarm if activated
      } else {
        // Deactivate the alarm if the sensor is turned off
        const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
        setActiveAlarms((prev) => ({ ...prev, [alarmKey]: false }));
      }
      return newState;
    });
  };

  // Function to silence the alarm
  const silenceAlarm = (alarm) => {
    setActiveAlarms((prev) => ({ ...prev, [alarm]: false }));
  };

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
            {["fireSensor", "smokeSensor", "securitySensor"].map((sensor) => {
              // Select the corresponding icon based on the sensor type
              const sensorIcon = {
                fireSensor: (
                  <img
                    src={flameIcon}
                    alt="Fire Sensor"
                    className="sensor-icon"
                  />
                ),
                smokeSensor: (
                  <img
                    src={smokeIcon}
                    alt="Smoke Sensor"
                    className="sensor-icon"
                  />
                ),
                securitySensor: (
                  <img
                    src={securitySafeIcon}
                    alt="Security Sensor"
                    className="sensor-icon"
                  />
                ),
              }[sensor];

              return (
                <div className="sensor-card" key={sensor}>
                  {sensorIcon}
                  <button
                    className="alarm-button"
                    style={{
                      backgroundColor: activatedSensors[sensor]
                        ? "green"
                        : "blue", // Green if activated, otherwise blue
                    }}
                    onClick={() => triggerAlarm(sensor)}
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
            })}
          </div>
        </section>
        <section className="alarms-section">
          <h2>Alarms</h2>
          <div className="alarm-cards-container">
            {["fireAlarm", "smokeAlarm", "securityAlarm"].map((alarm) => {
              // Select the corresponding icon based on the alarm type
              const alarmIcon = {
                fireAlarm: (
                  <img
                    src={flameIcon}
                    alt="Fire Alarm"
                    className="alarm-icon"
                  />
                ),
                smokeAlarm: (
                  <img
                    src={smokeIcon}
                    alt="Smoke Alarm"
                    className="alarm-icon"
                  />
                ),
                securityAlarm: (
                  <img
                    src={securitySafeIcon}
                    alt="Security Alarm"
                    className="alarm-icon"
                  />
                ),
              }[alarm];

              return (
                <div className="alarm-card" key={alarm}>
                  {alarmIcon}
                  <button
                    className="alarm-button"
                    style={{
                      backgroundColor: activeAlarms[alarm] ? "red" : "blue", // Red if alarm is active, otherwise blue
                    }}
                    onClick={() => silenceAlarm(alarm)} // Call silenceAlarm on click
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
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
