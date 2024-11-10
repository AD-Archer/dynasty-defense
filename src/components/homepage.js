import React, { useState, useEffect, Suspense } from "react";
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
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
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
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
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

  const [customSensors, setCustomSensors] = useState([]);

  useEffect(() => {
    // Component initialization tasks
    checkUserLogin();

    // Load custom sensors and states only once on mount
    const storedCustomSensors = JSON.parse(
      localStorage.getItem("customSensors") || "[]"
    );
    setCustomSensors(storedCustomSensors);
    setLastTriggeredTimes(loadStoredState("lastTriggeredTimes", {}));
    setActivatedSensors(loadStoredState("activatedSensors", {}));
    setActiveAlarms(loadStoredState("activeAlarms", {}));

    // Function to get a random delay between min and max (in milliseconds)
    const getRandomDelay = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Set up an interval to check sensor statuses periodically
    let intervalId;
    const checkSensors = () => {
      const currentActivatedSensors = loadStoredState("activatedSensors", {});
      const currentAlarms = loadStoredState("activeAlarms", {});
      let alarmsUpdated = false;
      const newAlarms = { ...currentAlarms };

      // Check each sensor and update corresponding alarm
      Object.keys(currentActivatedSensors).forEach((sensor) => {
        const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
        if (!currentActivatedSensors[sensor]) {
          // If sensor is inactive, silence its alarm
          if (newAlarms[alarmKey]) {
            newAlarms[alarmKey] = false;
            alarmsUpdated = true;
          }
        } else if (currentActivatedSensors[sensor] && Math.random() < 0.2) {
          // 20% chance to trigger alarm if not already triggered
          if (!newAlarms[alarmKey]) {
            newAlarms[alarmKey] = true;
            alarmsUpdated = true;
            const currentTime = new Date().toLocaleTimeString();
            const updatedTimes = {
              ...loadStoredState("lastTriggeredTimes", {}),
              [alarmKey]: currentTime,
            };
            localStorage.setItem(
              "lastTriggeredTimes",
              JSON.stringify(updatedTimes)
            );
            setLastTriggeredTimes(updatedTimes);
            logEvent(`${alarmKey} triggered at ${currentTime}`);
          }
        }
      });

      // Only update state if changes were made
      if (alarmsUpdated) {
        localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
        setActiveAlarms(newAlarms);
      }

      // Set the next check with a random delay
      intervalId = setTimeout(checkSensors, getRandomDelay(2000, 10000));
    };

    // Start the first check
    checkSensors();

    // Cleanup function
    return () => {
      if (intervalId) {
        clearTimeout(intervalId);
      }
    };
  }, []); // Empty dependency array since we're loading from localStorage

  // Add a separate useEffect for handling activatedSensors changes
  useEffect(() => {
    localStorage.setItem("activatedSensors", JSON.stringify(activatedSensors));
  }, [activatedSensors]);

  /**
   * Renders a sensor card.
   * @param {string} sensor - The sensor name.
   * @param {string} icon - The sensor icon.
   * @returns {JSX.Element} The sensor card element.
   */
  const renderSensorCard = (sensorData, index) => (
    <div className="sensor-card" key={`sensor-${sensorData.id}-${index}`}>
      <div className="sensor-icon custom-icon">
        <span>{sensorData.icon}</span>
      </div>
      <h3>📡 {sensorData.name} Sensor</h3>
      <button
        className="alarm-button"
        onClick={() => toggleSensor(sensorData.sensorKey)}
      >
        {activatedSensors[sensorData.sensorKey] ? "● Active" : "○ Inactive"}
      </button>
      <p className="last-triggered-text">
        Last Activated: {lastTriggeredTimes[sensorData.sensorKey] || "Never"}
      </p>
    </div>
  );

  /**
   * Renders an alarm card.
   * @param {string} alarm - The alarm name.
   * @param {string} icon - The alarm icon.
   * @returns {JSX.Element} The alarm card element.
   */
  const renderAlarmCard = (sensorData, index) => (
    <div 
      className="alarm-card" 
      key={`alarm-${sensorData.id}-${index}`}
      data-active={activeAlarms[sensorData.alarmKey]}
    >
      <div className="alarm-icon custom-icon">
        <span>{sensorData.icon}</span>
      </div>
      <h3>🚨 {sensorData.name} Alarm</h3>
      <p className="last-triggered-text">
        Status: {activeAlarms[sensorData.alarmKey] ? 
          <strong style={{color: '#ff4444'}}>⚠️ ACTIVE</strong> : 
          <span style={{color: '#4CAF50'}}>✓ Silent</span>
        }
      </p>
      <button
        className="alarm-button"
        onClick={() => silenceAlarm(sensorData.alarmKey)}
        disabled={!activeAlarms[sensorData.alarmKey]}
      >
        {activeAlarms[sensorData.alarmKey] ? "🔕 Silence Alarm" : "Alarm Silent"}
      </button>
      <p className="last-triggered-text">
        Last Triggered: {lastTriggeredTimes[sensorData.alarmKey] || "Never"}
      </p>
    </div>
  );

  // Update the silenceAlarm function
  const silenceAlarm = (alarmKey) => {
    if (!user?.isAdmin) {
      alert("Only the admin can silence alarms.");
      return;
    }

    setActiveAlarms((prev) => {
      const newAlarms = { ...prev, [alarmKey]: false };
      localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
      logEvent(`Silenced ${alarmKey} alarm.`);
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
    } else {
      // If sensor is not active, ensure the corresponding alarm is silenced
      silenceAlarmForSensor(sensor);
    }
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="home-container">
          <Sidebar
            user={user}
            handleSignOut={handleSignOut}
            isCollapsed={isSidebarCollapsed}
          />
          <main className="main-content">
            <h1 className="header-title">Defense Panel</h1>

            {/* Sensors Section */}
            <section className="sensors-section">
              <h2>Sensors</h2>
              {customSensors.length === 0 ? (
                <div className="empty-state-message">
                  {user?.isAdmin ? (
                    <div>
                      <p>No sensors have been created yet.</p>
                      <Link to="/settings" className="primary-button">
                        Go to Settings to Create Sensors
                      </Link>
                    </div>
                  ) : (
                    <p>
                      No sensors available. Please contact your system
                      administrator to set up sensors.
                    </p>
                  )}
                </div>
              ) : (
                <div className="sensor-cards-container">
                  {/* Custom sensors */}
                  {customSensors.map((sensor, index) => (
                    <div
                      className="sensor-card"
                      key={`sensor-${sensor.id}-${index}`}
                    >
                      <div className="sensor-icon custom-icon">
                        <span>{sensor.icon}</span>
                      </div>
                      <h3>{sensor.name}</h3>
                      <button
                        className="alarm-button"
                        style={{
                          backgroundColor: activatedSensors[sensor.sensorKey]
                            ? "green"
                            : "blue",
                        }}
                        onClick={() => toggleSensor(sensor.sensorKey)}
                      >
                        {activatedSensors[sensor.sensorKey]
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                      <p className="last-triggered-text">
                        Last Activated:{" "}
                        {lastTriggeredTimes[sensor.sensorKey] || "Never"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Alarms Section */}
            <section className="alarms-section">
              <h2>Alarms</h2>
              {customSensors.length === 0 ? (
                <div className="empty-state-message">
                  {user?.isAdmin ? (
                    <div>
                      <p>
                        No alarms available. Alarms are created automatically
                        when you create sensors.
                      </p>
                      <Link to="/settings" className="primary-button">
                        Go to Settings to Create Sensors
                      </Link>
                    </div>
                  ) : (
                    <p>
                      No alarms available. Please contact your system
                      administrator to set up sensors and alarms.
                    </p>
                  )}
                </div>
              ) : (
                <div className="alarm-cards-container">
                  {/* Custom alarms */}
                  {customSensors.map((sensor, index) => (
                    <div
                      className="alarm-card"
                      key={`alarm-${sensor.id}-${index}`}
                    >
                      <div className="alarm-icon custom-icon">
                        <span>{sensor.icon}</span>
                      </div>
                      <h3>{sensor.name} Alarm</h3>
                      <p className="last-triggered-text">
                        Active Since:{" "}
                        {activeAlarms[sensor.alarmKey]
                          ? lastTriggeredTimes[sensor.alarmKey]
                          : "Not active"}
                      </p>
                      <button
                        className="alarm-button"
                        style={{
                          backgroundColor: activeAlarms[sensor.alarmKey]
                            ? "red"
                            : "blue",
                        }}
                        onClick={() => silenceAlarm(sensor.alarmKey)}
                      >
                        Silence Alarm
                      </button>
                      <p className="last-triggered-text">
                        Last Triggered:{" "}
                        {lastTriggeredTimes[sensor.alarmKey] || "Never"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

// Add error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to your error reporting service
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h1>Something went wrong.</h1>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Add error handling to localStorage setItem operations
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};
