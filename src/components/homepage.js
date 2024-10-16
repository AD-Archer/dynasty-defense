import React, { useState, useEffect } from "react";
import "./styles/homepage.css";

// Importing custom SVG icons for different sensors and alarms
import flameIcon from "../assets/images/Flame icon.svg";
import securitySafeIcon from "../assets/images/Security Safe Icon.svg";
import smokeIcon from "../assets/images/Smoke icon.svg";

// This is the main component for the homepage of my defense system monitoring panel
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

  const [sensorIntervals, setSensorIntervals] = useState({}); // Store intervals for sensors

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  // Function to randomly trigger an alarm when a sensor is activated
  const randomTriggerAlarm = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;

    const intervalId = setInterval(() => {
      if (activatedSensors[sensor]) {
        // Adjust the probability of triggering based on your desired frequency
        const triggerProbability = 0.05; // Adjust this value as needed

        if (Math.random() < triggerProbability) {
          const currentTime = new Date().toLocaleTimeString();
          setLastTriggeredTimes((prev) => ({
            ...prev,
            [alarmKey]: currentTime,
          }));
          setActiveAlarms((prev) => ({ ...prev, [alarmKey]: true }));
        }
      } else {
        clearInterval(intervalId);
      }
    }, 5000); // Adjust the interval as needed

    // Store the interval ID
    setSensorIntervals((prev) => ({ ...prev, [sensor]: intervalId }));
  };

  // Function to toggle a sensor's activation state
  const toggleSensor = (sensor) => {
    const currentTime = new Date().toLocaleTimeString();

    setActivatedSensors((prev) => {
      const newState = { ...prev, [sensor]: !prev[sensor] };
      setLastTriggeredTimes((prev) => ({
        ...prev,
        [sensor]: currentTime,
      }));

      // Start or stop triggering alarms based on sensor activation
      if (newState[sensor]) {
        randomTriggerAlarm(sensor);
      } else {
        silenceAlarmForSensor(sensor);
      }
      return newState;
    });
  };

  const silenceAlarmForSensor = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
    setActiveAlarms((prev) => ({ ...prev, [alarmKey]: false }));

    // Clear the interval when the sensor is deactivated
    const intervalId = sensorIntervals[sensor];
    if (intervalId) {
      clearInterval(intervalId);
      setSensorIntervals((prev) => {
        const newIntervals = { ...prev };
        delete newIntervals[sensor]; // Remove the interval for the deactivated sensor
        return newIntervals;
      });
    }
  };

  const silenceAlarm = (alarm) => {
    console.log("currentUser:", currentUser);
    console.log("isAdmin:", currentUser?.isAdmin); // Ensure this outputs correctly

    if (currentUser?.isAdmin) {
      setActiveAlarms((prev) => ({ ...prev, [alarm]: false }));
      console.log(`Silenced ${alarm} alarm.`);
    } else {
      alert(
        "You do not have permission to silence alarms. Only the admin can perform this action."
      );
    }
  };

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

  useEffect(() => {
    // Assuming loadUserData is called to log the username; this could be improved based on actual use
    const username = loadUserData();
    console.log("Loaded username:", username);
  }, []);

  const loadUserData = () => {
    // Simulating user data load; adjust as needed for actual implementation
    const userData = { username: "JohnDoe" };
    return userData.username;
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
