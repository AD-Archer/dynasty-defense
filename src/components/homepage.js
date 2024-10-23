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
    setLastTriggeredTimes(
      loadStoredState("lastTriggeredTimes", lastTriggeredTimes)
    );
    setActivatedSensors((prev) => {
      const storedSensors = loadStoredState("activatedSensors", prev);
      Object.keys(storedSensors).forEach((sensor) => {
        if (storedSensors[sensor]) {
          randomTriggerAlarm(sensor); // Trigger alarms for active sensors
        }
      });
      return storedSensors;
    });
  }, []);

  /**
   * Toggles the sidebar collapse state.
   */
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  /**
   * Randomly triggers an alarm for a specified sensor with interval handling.
   * @param {string} sensor - The sensor name.
   */
  const randomTriggerAlarm = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;

    const triggerAlarm = () => {
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

  /**
   * Toggles the activation state of a sensor and handles alarm triggering.
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
        }
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

  /**
   * Checks if a user is logged in and redirects if not.
   */
  const checkUserLogin = () => {
    if (!loadStoredState("currentUser", null)) {
      navigate("/");
    }
  };

  /**
   * Silences an alarm for a given sensor.
   * @param {string} sensor - The sensor associated with the alarm.
   */
  const silenceAlarmForSensor = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
    setActiveAlarms((prev) => {
      const newAlarms = { ...prev, [alarmKey]: false };
      localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
      logEvent(`Silenced ${alarmKey}.`);
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
