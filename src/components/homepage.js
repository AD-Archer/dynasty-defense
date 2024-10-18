import React, { useState, useEffect } from "react"; // Importing React and useState for state management
import { Link } from "react-router-dom"; // Importing Link for navigation
import "./styles/homepage.css"; // Importing CSS for styling
import flameIcon from "../assets/images/Flame icon.svg"; // Importing custom SVG icons
import securitySafeIcon from "../assets/images/Security Safe Icon.svg"; // Importing custom SVG icons
import smokeIcon from "../assets/images/Smoke icon.svg"; // Importing custom SVG icons

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

  const [sensorIntervals, setSensorIntervals] = useState({});
  const [user, setUser] = useState(null);

  // Load user data from local storage
  const loadUserData = () => {
    const storedUserData = localStorage.getItem("currentUser");
    return storedUserData ? JSON.parse(storedUserData) : null; // Return null if no user data found
  };

  // Load last triggered times from local storage
  const loadLastTriggeredTimes = () => {
    const storedTimes = localStorage.getItem("lastTriggeredTimes");
    return storedTimes ? JSON.parse(storedTimes) : {}; // Return empty object if no times found
  };

  // Load activated sensors from local storage
  const loadActivatedSensors = () => {
    const storedSensors = localStorage.getItem("activatedSensors");
    return storedSensors ? JSON.parse(storedSensors) : {}; // Return empty object if no sensors found
  };

  useEffect(() => {
    const userData = loadUserData();
    console.log("Loaded user data:", userData);
    setUser(userData);

    // Load last triggered times and activated sensors and set them in state
    const loadedTimes = loadLastTriggeredTimes();
    const loadedSensors = loadActivatedSensors();

    setLastTriggeredTimes((prev) => ({
      ...prev,
      ...loadedTimes,
    }));

    setActivatedSensors((prev) => ({
      ...prev,
      ...loadedSensors,
    }));
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

const randomTriggerAlarm = (sensor) => {
  const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;

  // Function to trigger the alarm
  const triggerAlarm = () => {
    const currentTime = new Date().toLocaleTimeString();
    setLastTriggeredTimes((prev) => {
      const updatedTimes = { ...prev, [alarmKey]: currentTime };
      localStorage.setItem("lastTriggeredTimes", JSON.stringify(updatedTimes)); // Save to local storage
      return updatedTimes;
    });

    setActiveAlarms((prev) => ({ ...prev, [alarmKey]: true }));
    console.log(`${alarmKey} triggered at ${currentTime}`);
  };

  // Clear any existing interval for this sensor
  if (sensorIntervals[sensor]) {
    clearInterval(sensorIntervals[sensor]);
  }

  // Start an interval to randomly trigger the alarm every 3 to 10 seconds
  const intervalId = setInterval(() => {
    const shouldTrigger = Math.random() < 0.5; // 50% chance to trigger alarm each interval
    if (shouldTrigger) {
      triggerAlarm();
    }
  }, Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000); // Random interval between 3 and 10 seconds

  // Save the interval ID for cleanup later
  setSensorIntervals((prev) => ({
    ...prev,
    [sensor]: intervalId,
  }));
};


  const triggerAlarm = (sensor) => {
    const currentTime = new Date().toLocaleTimeString();
    setLastTriggeredTimes((prev) => {
      const updatedTimes = { ...prev, [sensor]: currentTime };
      localStorage.setItem("lastTriggeredTimes", JSON.stringify(updatedTimes)); // Save to local storage
      return updatedTimes;
    });
  };

  const toggleSensor = (sensor) => {
    const currentTime = new Date().toLocaleTimeString();

    setActivatedSensors((prev) => {
      const newState = { ...prev, [sensor]: !prev[sensor] };
      setLastTriggeredTimes((prev) => ({
        ...prev,
        [sensor]: currentTime,
      }));

      // Save activated sensors to local storage
      localStorage.setItem("activatedSensors", JSON.stringify(newState));

      if (newState[sensor]) {
        randomTriggerAlarm(sensor);
      } else {
        silenceAlarmForSensor(sensor);
      }

      // Save last triggered time to local storage
      localStorage.setItem(
        "lastTriggeredTimes",
        JSON.stringify(lastTriggeredTimes)
      );

      return newState;
    });
  };

  const silenceAlarmForSensor = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
    setActiveAlarms((prev) => ({ ...prev, [alarmKey]: false }));

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

  const silenceAlarm = (alarm) => {
    if (user?.isAdmin) {
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
          Last Activated: {lastTriggeredTimes[sensor]}
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
    // Cleanup function to clear any active intervals when the component unmounts
    return () => {
      Object.values(sensorIntervals).forEach(clearInterval);
    };
  }, [sensorIntervals]);

  return (
    <div className="home-container">
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <button className="sidebar-button" onClick={toggleSidebar}>
          {isSidebarCollapsed ? "Expand" : "Collapse"}
        </button>
        <button className="sidebar-button">Sensors</button>
        <button className="sidebar-button">Alarms</button>
        <Link to="/settings">
          <button className="sidebar-button settings-button">Settings</button>
        </Link>
      </aside>

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

        <section className="custom-sensors">
          <h2>Custom Sensors</h2>
          <div className="custom-sensors-container">
            {/* Custom Cards go here */}
          </div>
        </section>

        <section className="custom-alarms">
          <h2>Custom Alarms</h2>
          <div className="custom-alarms-container">
            {/* Custom Alarms go here */}
          </div>
        </section>
      </main>
    </div>
  );
}
