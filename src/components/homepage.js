import React, { useState, useEffect } from "react";
import "./styles/homepage.css";

// Importing custom SVG icons for different sensors and alarms
import flameIcon from "../assets/images/Flame icon.svg";
import securitySafeIcon from "../assets/images/Security Safe Icon.svg";
import smokeIcon from "../assets/images/Smoke icon.svg";

// This is the main component for the homepage of my defense system monitoring panel
export default function HomePage({ currentUser }) {
  // State to keep track of whether the sidebar is collapsed
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Keeping track of the last time each sensor or alarm was triggered
  const [lastTriggeredTimes, setLastTriggeredTimes] = useState({
    fireSensor: "Never",
    smokeSensor: "Never",
    securitySensor: "Never",
    fireAlarm: "Never",
    smokeAlarm: "Never",
    securityAlarm: "Never",
  });

  // State to track which alarms are currently active
  const [activeAlarms, setActiveAlarms] = useState({
    fireAlarm: false,
    smokeAlarm: false,
    securityAlarm: false,
  });

  // Keeping track of which sensors are currently activated
  const [activatedSensors, setActivatedSensors] = useState({
    fireSensor: false,
    smokeSensor: false,
    securitySensor: false,
  });

  // This function toggles the sidebar between collapsed and expanded
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // State to track if the sensor is active
  const [activeSensors, setActiveSensors] = useState({});

  // Function to randomly trigger an alarm when a sensor is activated
  const randomTriggerAlarm = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`; // Mapping sensor name to its corresponding alarm

    // Start an interval to check the sensor status every 5 seconds (adjust as needed)
    const intervalId = setInterval(() => {
      // Check if the sensor is still active
      if (activeSensors[sensor]) {
        // 50% chance to trigger the alarm
        if (Math.random() < 0.5) {
          const currentTime = new Date().toLocaleTimeString(); // Getting the current time
          // Updating the last triggered time and setting the alarm to active
          setLastTriggeredTimes((prev) => ({
            ...prev,
            [alarmKey]: currentTime,
          }));
          setActiveAlarms((prev) => ({ ...prev, [alarmKey]: true }));
        }
      } else {
        clearInterval(intervalId); // Clear the interval if the sensor is inactive
      }
    }, 5000);

    // Set the sensor as active when triggering the alarm
    setActiveSensors((prev) => ({ ...prev, [sensor]: true }));

    // Return a function to stop the interval if the sensor is deactivated
    return () => {
      setActiveSensors((prev) => ({ ...prev, [sensor]: false })); // Mark the sensor as inactive
      clearInterval(intervalId);
    };
  };

  // Function to toggle a sensor's activation state
  const toggleSensor = (sensor) => {
    const currentTime = new Date().toLocaleTimeString(); // Getting the current time
    setActivatedSensors((prev) => {
      const newState = { ...prev, [sensor]: !prev[sensor] }; // Toggling the sensor's state
      // Updating the last triggered time for the sensor
      setLastTriggeredTimes((prev) => ({
        ...prev,
        [sensor]: currentTime,
      }));

      if (newState[sensor]) {
        const stopAlarm = randomTriggerAlarm(sensor); // Trigger alarm if sensor is activated
        return newState; // Return the new state of sensors
      } else {
        const alarmKey = `${sensor.replace("Sensor", "Alarm")}`; // Mapping sensor name to its corresponding alarm
        // Deactivating the alarm if the sensor is deactivated
        setActiveAlarms((prev) => ({ ...prev, [alarmKey]: false }));
        return newState; // Return the new state of sensors
      }
    });
  };

  // Function to silence an alarm, only if the current user is an admin
  const silenceAlarm = (alarm) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Check if currentUser exists and is an admin
    if (currentUser && currentUser.isAdmin) {
      setActiveAlarms((prev) => ({ ...prev, [alarm]: false }));
    } else {
      alert(
        "You do not have permission to silence alarms. Only the admin can perform this action."
      );
    }
  };

  // Helper function to generate the UI for each sensor card
  const renderSensorCard = (sensor, icon) => (
    <div className="sensor-card" key={sensor}>
      <img src={icon} alt={`${sensor} Icon`} className="sensor-icon" />
      <button
        className="alarm-button"
        style={{ backgroundColor: activatedSensors[sensor] ? "green" : "blue" }} // Button color indicates if the sensor is active
        onClick={() => toggleSensor(sensor)}
      >
        {activatedSensors[sensor] ? "Deactivate" : "Activate"}
      </button>
      {!isSidebarCollapsed && (
        <p className="last-triggered-text">
          Last Triggered: {lastTriggeredTimes[sensor]}{" "}
          {/* Displaying the last time the sensor was triggered */}
        </p>
      )}
    </div>
  );

  // Helper function to generate the UI for each alarm card
  const renderAlarmCard = (alarm, icon) => (
    <div className="alarm-card" key={alarm}>
      <img src={icon} alt={`${alarm} Icon`} className="alarm-icon" />
      <button
        className="alarm-button"
        style={{ backgroundColor: activeAlarms[alarm] ? "red" : "blue" }} // Button color indicates if the alarm is active
        onClick={() => silenceAlarm(alarm)}
      >
        Silence Alarm
      </button>
      {!isSidebarCollapsed && (
        <p className="last-triggered-text">
          Last Triggered: {lastTriggeredTimes[alarm]}{" "}
          {/* Displaying the last time the alarm was triggered */}
        </p>
      )}
    </div>
  );

  // Function to load user data
  const loadUserData = () => {
    // Simulating an API call to fetch user data
    const userData = {
      username: "JohnDoe",
    };
    return userData.username;
  };

  useEffect(() => {
    const username = loadUserData();
    console.log("Loaded username:", username);
  }, []);

  // Main render function for the component
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
            {renderSensorCard("fireSensor", flameIcon)}{" "}
            {/* Rendering the fire sensor card */}
            {renderSensorCard("smokeSensor", smokeIcon)}{" "}
            {/* Rendering the smoke sensor card */}
            {renderSensorCard("securitySensor", securitySafeIcon)}{" "}
            {/* Rendering the security sensor card */}
          </div>
        </section>

        <section className="alarms-section">
          <h2>Alarms</h2>
          <div className="alarm-cards-container">
            {renderAlarmCard("fireAlarm", flameIcon)}{" "}
            {/* Rendering the fire alarm card */}
            {renderAlarmCard("smokeAlarm", smokeIcon)}{" "}
            {/* Rendering the smoke alarm card */}
            {renderAlarmCard("securityAlarm", securitySafeIcon)}{" "}
            {/* Rendering the security alarm card */}
          </div>
        </section>
      </main>
    </div>
  );
}
