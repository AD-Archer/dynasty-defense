import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/homepage.css";
import flameIcon from "../assets/images/Flame icon.svg";
import securitySafeIcon from "../assets/images/Security Safe Icon.svg";
import smokeIcon from "../assets/images/Smoke icon.svg";
import Sidebar from "./SideBar";

export default function HomePage({ currentUser }) {
  const navigate = useNavigate(); // Initialize navigate for navigation
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Use descriptive states for clarity
  const [lastTriggeredTimes, setLastTriggeredTimes] = useState({
    fireSensor: "Never",
    smokeSensor: "Never",
    securitySensor: "Never",
    fireAlarm: "Never",
    smokeAlarm: "Never",
    securityAlarm: "Never",
  });

  // Load initial state from local storage with fallback defaults
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

  const [sensorIntervals, setSensorIntervals] = useState({});
  const [user, setUser] = useState(loadInitialState("currentUser", null));

  // Unified function for loading various stored states
  const loadStoredState = (key, defaultValue) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  };

  // Function to log events
  const logEvent = (action) => {
    const logs = loadStoredState("logs", []);
    const newLog = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      user: user?.username || "Unknown User", // Get username or fallback
      action, // Use the action message directly
    };
    logs.push(newLog);
    localStorage.setItem("logs", JSON.stringify(logs));
  };

  // Function to sign out user and redirect to login
  const handleSignOut = () => {
    logEvent(`${user.username} signed out.`);
    localStorage.removeItem("currentUser"); // Clear user data
    navigate("/"); // Redirect to register page
  };

  useEffect(() => {
    // Load user, last triggered times, and activated sensors on mount
    checkUserLogin(); // Validate user login status on mount

    // Update states with stored values
    setLastTriggeredTimes(
      loadStoredState("lastTriggeredTimes", lastTriggeredTimes)
    );
    setActivatedSensors((prev) => {
      const storedSensors = loadStoredState("activatedSensors", prev);

      // Trigger alarms for already activated sensors
      Object.keys(storedSensors).forEach((sensor) => {
        if (storedSensors[sensor]) {
          randomTriggerAlarm(sensor);
        }
      });

      return storedSensors;
    });
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  // Function to handle random alarm triggering
  const randomTriggerAlarm = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;

    // Triggering the alarm with interval handling
    const triggerAlarm = () => {
      const currentTime = new Date().toLocaleTimeString();

      // Update only if the alarm is inactive
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
          logEvent(`${alarmKey} triggered at ${currentTime}`); // Log the alarm triggering
          return newAlarms;
        });
      }
    };

    if (!activeAlarms[alarmKey]) {
      const intervalId = setInterval(() => {
        if (Math.random() < 0.5) {
          triggerAlarm();
          clearInterval(intervalId);
        }
      }, Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000);

      setSensorIntervals((prev) => ({ ...prev, [sensor]: intervalId }));
    }
  };

  const toggleSensor = (sensor) => {
    const currentTime = new Date().toLocaleTimeString();

    setActivatedSensors((prev) => {
      const newState = { ...prev, [sensor]: !prev[sensor] };

      setLastTriggeredTimes((prev) => {
        const updatedTimes = { ...prev };

        // Update last triggered time only when activating the sensor
        if (newState[sensor]) {
          updatedTimes[sensor] = currentTime; // Set the current time if activating
          logEvent(`${sensor} activated at ${currentTime}`); // Log the sensor activation
        }
        // No need to set it to "Never" when deactivating
        // updatedTimes[sensor] = newState[sensor] ? currentTime : "Never";

        localStorage.setItem(
          "lastTriggeredTimes",
          JSON.stringify(updatedTimes)
        );
        return updatedTimes;
      });

      localStorage.setItem("activatedSensors", JSON.stringify(newState));

      if (newState[sensor]) {
        randomTriggerAlarm(sensor);
      } else {
        silenceAlarmForSensor(sensor);
      }

      return newState;
    });
  };

  const checkUserLogin = () => {
    if (!loadStoredState("currentUser", null)) {
      navigate("/"); // Redirect to login page if not signed in
    }
  };

  // Silence alarm for a specific sensor
  const silenceAlarmForSensor = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
    setActiveAlarms((prev) => {
      const newAlarms = { ...prev, [alarmKey]: false };
      localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
      logEvent(`Silenced ${alarmKey}.`); // Log the silencing of the alarm
      return newAlarms;
    });

    const intervalId = sensorIntervals[sensor];
    if (intervalId) {
      clearInterval(intervalId);
      setSensorIntervals((prev) => {
        const newIntervals = { ...prev };
        delete newIntervals[sensor];
        return newIntervals;
      });
    }
  };

  // Silence an alarm if user is admin
  const silenceAlarm = (alarm) => {
    if (user?.isAdmin) {
      setActiveAlarms((prev) => {
        const newAlarms = { ...prev, [alarm]: false };
        localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
        logEvent(`Silenced ${alarm} alarm.`); // Log the silencing of the alarm
        return newAlarms;
      });
      console.log(`Silenced ${alarm} alarm.`);
    } else {
      alert("Only the admin can perform this action.");
    }
  };

  // Render sensor cards
  const renderSensorCard = (sensor, icon) => (
    <div className="sensor-card" key={sensor}>
      <img src={icon} alt={`${sensor} Icon`} className="sensor-icon" />
      <h3>{sensor.replace("Sensor", "")}</h3> {/* Added title for clarity */}
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

  // Render alarm cards
  const renderAlarmCard = (alarm, icon) => (
    <div className="alarm-card" key={alarm}>
      <img src={icon} alt={`${alarm} Icon`} className="alarm-icon" />
      <h3>{alarm.replace("Alarm", "")}</h3> {/* Added title for clarity */}
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
