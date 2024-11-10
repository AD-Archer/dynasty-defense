import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/homepage.css";
import flameIcon from "../assets/images/Flame icon.svg";
import securitySafeIcon from "../assets/images/Security Safe Icon.svg";
import smokeIcon from "../assets/images/Smoke icon.svg";
import Sidebar from "./SideBar";

/**
 * The main component for the HomePage.
 * Manages sensor and alarm states, user authentication, and rendering.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.currentUser - The currently logged-in user.
 * @returns {JSX.Element} The rendered HomePage component.
 */
export default function HomePage({ currentUser }) {
  const navigate = useNavigate(); // Initialize navigate for navigation
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Sidebar toggle state

  /**
   * State to store the last triggered times of sensors and alarms.
   * @type {Object}
   */
  const [lastTriggeredTimes, setLastTriggeredTimes] = useState({
    fireSensor: "Never",
    smokeSensor: "Never",
    securitySensor: "Never",
    fireAlarm: "Never",
    smokeAlarm: "Never",
    securityAlarm: "Never",
  });

  /**
   * Loads an initial state from local storage or sets a default value.
   * @param {string} key - The local storage key.
   * @param {any} defaultValue - The default value if not found in local storage.
   * @returns {any} The loaded or default value.
   */
  const loadInitialState = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [activeAlarms, setActiveAlarms] = useState(
    loadInitialState("activeAlarms", {
      fireAlarm: false,
      smokeAlarm: false,
      securityAlarm: false,
    })
  );

  const [activatedSensors, setActivatedSensors] = useState(
    loadInitialState("activatedSensors", {
      fireSensor: false,
      smokeSensor: false,
      securitySensor: false,
    })
  );

  const [sensorIntervals, setSensorIntervals] = useState({}); // Stores intervals for random alarm triggers
  const [user, setUser] = useState(loadInitialState("currentUser", null)); // The current user state

  /**
   * Loads state from local storage with a specified fallback default.
   * @param {string} key - The storage key.
   * @param {any} defaultValue - The default value.
   * @returns {any} The stored or default value.
   */
  const loadStoredState = (key, defaultValue) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  };

  /**
   * Logs an action event with the current time, date, and user.
   * @param {string} action - The action description.
   */
  const logEvent = (action) => {
    const logs = loadStoredState("logs", []);
    const newLog = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      user: user?.username || "Unknown User",
      action,
    };

    // Check if the last log is the same as the new log
    const lastLog = logs[logs.length - 1];
    if (
      lastLog &&
      lastLog.action === newLog.action &&
      lastLog.date === newLog.date &&
      lastLog.time === newLog.time
    ) {
      return; // Skip adding the log if it's a duplicate
    }

    logs.push(newLog);
    localStorage.setItem("logs", JSON.stringify(logs));
  };

  /**
   * Handles user sign-out by logging the event, clearing data, and redirecting.
   */
  const handleSignOut = () => {
    logEvent(`${user.username} signed out.`);
    localStorage.removeItem("currentUser");
    navigate("/");
  };

useEffect(() => {
  // Component initialization tasks
  checkUserLogin(); // Validate user login status

  // Load last triggered times and activated sensors from local storage
  setLastTriggeredTimes(
    loadStoredState("lastTriggeredTimes", lastTriggeredTimes)
  );
  const storedActivatedSensors = loadStoredState(
    "activatedSensors",
    activatedSensors
  );
  setActivatedSensors(storedActivatedSensors);

  // Trigger alarms for active sensors initially
  Object.keys(storedActivatedSensors).forEach((sensor) => {
    if (storedActivatedSensors[sensor]) {
      triggerAlarmForSensor(sensor); // Trigger the alarm if the sensor is active
    }
  });

  // Function to get a random delay between min and max (in milliseconds)
  const getRandomDelay = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Set up an interval to check sensor statuses periodically
  let intervalId;
  const checkSensors = () => {
    // Use the latest state for activatedSensors
    Object.keys(activatedSensors).forEach((sensor) => {
      // Re-check activated sensors status
      if (activatedSensors[sensor]) {
        triggerAlarmForSensor(sensor); // Trigger the alarm if the sensor is active
      }
    });

    // Set the next check with a random delay
    const delay = getRandomDelay(2000, 10000); // Random delay between 2 and 10 seconds
    intervalId = setTimeout(checkSensors, delay);
  };

  // Start the first check
  checkSensors();

  // Cleanup function
  return () => {
    // Clear the interval when the component unmounts
    clearTimeout(intervalId);
  };
}, []);
  /**
   * Triggers an alarm for a specified sensor if the sensor is active.
   * @param {string} sensor - The sensor name.
   */
  const triggerAlarmForSensor = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;

    // Only trigger the alarm if the sensor is active
    if (activatedSensors[sensor]) {
      const currentTime = new Date().toLocaleTimeString();
      if (!activeAlarms[alarmKey]) {
        setLastTriggeredTimes((prev) => {
          const updatedTimes = { ...prev, [alarmKey]: currentTime };
          localStorage.setItem(
            "lastTriggeredTimes",
            JSON.stringify(updatedTimes)
          );
          return updatedTimes;
        });

        setActiveAlarms((prev) => {
          const newAlarms = { ...prev, [alarmKey]: true };
          localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
          logEvent(`${alarmKey} triggered at ${currentTime}`);
          return newAlarms;
        });
      }
    }
  };

  /**
   * Silences the alarm for a specified sensor, regardless of whether the sensor is active.
   * @param {string} sensor - The sensor name.
   */
  const silenceAlarmForSensor = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;

    setActiveAlarms((prev) => {
      const newAlarms = { ...prev, [alarmKey]: false };
      localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
      logEvent(`Silenced ${alarmKey}.`);
      return newAlarms;
    });
  };

  /**
   * Updates the sensor activation state and handles related alarm behavior.
   * @param {string} sensor - The sensor name.
   */
  const toggleSensor = (sensor) => {
    const currentTime = new Date().toLocaleTimeString();

    setActivatedSensors((prev) => {
      const newState = { ...prev, [sensor]: !prev[sensor] };

      setLastTriggeredTimes((prev) => {
        const updatedTimes = { ...prev };
        if (newState[sensor]) {
          updatedTimes[sensor] = currentTime;
          logEvent(`${sensor} activated at ${currentTime}`);
          triggerAlarmForSensor(sensor); // Check to trigger alarm if activating sensor
        } else {
          silenceAlarmForSensor(sensor); // Silence alarm if deactivating sensor
        }
        localStorage.setItem(
          "lastTriggeredTimes",
          JSON.stringify(updatedTimes)
        );
        return updatedTimes;
      });

      localStorage.setItem("activatedSensors", JSON.stringify(newState));
      return newState;
    });
  };

  /**
   * Checks if a user is logged in and redirects if not.
   */
  const checkUserLogin = () => {
    if (!loadStoredState("currentUser", null)) {
      navigate("/");
    }
  };


  /**
   * Silences an alarm if the user has admin privileges.
   * @param {string} alarm - The alarm to be silenced.
   */
  const silenceAlarm = (alarm) => {
    if (user?.isAdmin) {
      setActiveAlarms((prev) => {
        const newAlarms = { ...prev, [alarm]: false };
        localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
        logEvent(`Silenced ${alarm} alarm.`);
        return newAlarms;
      });
    } else {
      alert("Only the admin can perform this action.");
    }
  };

  /**
   * Renders a sensor card.
   * @param {string} sensor - The sensor name.
   * @param {string} icon - The sensor icon.
   * @returns {JSX.Element} The sensor card element.
   */
  const renderSensorCard = (sensor, icon) => (
    <div className="sensor-card" key={sensor}>
      <img src={icon} alt={`${sensor} Icon`} className="sensor-icon" />
      <h3>{sensor.replace("Sensor", "")}</h3>
      <button
        className="alarm-button"
        style={{ backgroundColor: activatedSensors[sensor] ? "green" : "blue" }}
        onClick={() => toggleSensor(sensor)}
      >
        {activatedSensors[sensor] ? "Deactivate" : "Activate"}
      </button>
      <p className="last-triggered-text">
        Last Activated: {lastTriggeredTimes[sensor]}
      </p>
    </div>
  );

  /**
   * Renders an alarm card.
   * @param {string} alarm - The alarm name.
   * @param {string} icon - The alarm icon.
   * @returns {JSX.Element} The alarm card element.
   */
  const renderAlarmCard = (alarm, icon) => (
    <div className="alarm-card" key={alarm}>
      <img src={icon} alt={`${alarm} Icon`} className="alarm-icon" />
      <h3>{alarm.replace("Alarm", "")}</h3>
      <p className="last-triggered-text">
        Active Since:{" "}
        {activeAlarms[alarm] ? lastTriggeredTimes[alarm] : "Not active"}
      </p>
      <button
        className="alarm-button"
        style={{ backgroundColor: activeAlarms[alarm] ? "red" : "blue" }}
        onClick={() => silenceAlarm(alarm)}
      >
        Silence Alarm
      </button>
      <p className="last-triggered-text">
        Last Triggered: {lastTriggeredTimes[alarm]}
      </p>
    </div>
  );

  return (
    <div className="home-container">
      <Sidebar
        user={user}
        handleSignOut={handleSignOut}
        isCollapsed={isSidebarCollapsed}
      />
      <main className="main-content">
        <h1 className="header-title">Defense Panel</h1>
        <section className="sensors-section">
          <h2>Main Sensors</h2>
          <div className="sensor-cards-container">
            {renderSensorCard("fireSensor", flameIcon)}
            {renderSensorCard("smokeSensor", smokeIcon)}
            {renderSensorCard("securitySensor", securitySafeIcon)}
          </div>
        </section>
        <section className="alarms-section">
          <h2>Main Alarms</h2>
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
