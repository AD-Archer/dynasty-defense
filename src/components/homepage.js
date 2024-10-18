import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/homepage.css";
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

  // Load the initial state from local storage
  const loadActiveAlarms = () => {
    const storedActiveAlarms = localStorage.getItem("activeAlarms");
    return storedActiveAlarms
      ? JSON.parse(storedActiveAlarms)
      : {
          fireAlarm: false,
          smokeAlarm: false,
          securityAlarm: false,
        };
  };

  const [activeAlarms, setActiveAlarms] = useState(loadActiveAlarms());

  const [activatedSensors, setActivatedSensors] = useState({
    fireSensor: false,
    smokeSensor: false,
    securitySensor: false,
  });

  const [sensorIntervals, setSensorIntervals] = useState({});
  const [user, setUser] = useState(loadUserData());

  function loadUserData() {
    const storedUserData = localStorage.getItem("currentUser");
    return storedUserData ? JSON.parse(storedUserData) : null;
  }

  function loadLastTriggeredTimes() {
    const storedTimes = localStorage.getItem("lastTriggeredTimes");
    return storedTimes ? JSON.parse(storedTimes) : {};
  }

  function loadActivatedSensors() {
    const storedSensors = localStorage.getItem("activatedSensors");
    return storedSensors ? JSON.parse(storedSensors) : {};
  }

  useEffect(() => {
    // Load last triggered times and activated sensors
    const loadedLastTriggeredTimes = loadLastTriggeredTimes();
    const loadedActivatedSensors = loadActivatedSensors();

    setLastTriggeredTimes((prev) => ({
      ...prev,
      ...loadedLastTriggeredTimes,
    }));

    setActivatedSensors((prev) => {
      const newState = {
        ...prev,
        ...loadedActivatedSensors,
      };

      // Check sensor states and trigger alarms if activated
      Object.keys(newState).forEach((sensor) => {
        if (newState[sensor]) {
          randomTriggerAlarm(sensor); // Trigger alarm if sensor is activated
        }
      });

      return newState;
    });
  }, []); // Runs on component mount only

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  const randomTriggerAlarm = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;

    // Trigger the alarm once and prevent further triggering
    const triggerAlarm = () => {
      const currentTime = new Date().toLocaleTimeString();

      // Only trigger the alarm if it's not already active
      if (!activeAlarms[alarmKey]) {
        setLastTriggeredTimes((prev) => {
          const updatedTimes = { ...prev, [alarmKey]: currentTime };
          localStorage.setItem(
            "lastTriggeredTimes",
            JSON.stringify(updatedTimes)
          );
          return updatedTimes;
        });

        // Update active alarms and local storage
        setActiveAlarms((prev) => {
          const newAlarms = { ...prev, [alarmKey]: true };
          localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
          return newAlarms;
        });

        console.log(`${alarmKey} triggered at ${currentTime}`);
      }
    };

    // Check if the alarm is already active; if not, set up a random triggering interval
    if (!activeAlarms[alarmKey]) {
      const intervalId = setInterval(() => {
        const shouldTrigger = Math.random() < 0.5; // 50% chance to trigger alarm
        if (shouldTrigger) {
          triggerAlarm();
          clearInterval(intervalId); // Stop the interval after triggering once
        }
      }, Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000); // Random interval between 3 and 10 seconds

      setSensorIntervals((prev) => ({
        ...prev,
        [sensor]: intervalId,
      }));
    }
  };

 const toggleSensor = (sensor) => {
   const currentTime = new Date().toLocaleTimeString();

   setActivatedSensors((prev) => {
     const newState = { ...prev, [sensor]: !prev[sensor] };

     // Update the last triggered time
     setLastTriggeredTimes((prev) => {
       const updatedTimes = {
         ...prev,
         [sensor]: newState[sensor] ? currentTime : "Never",
       };
       localStorage.setItem("lastTriggeredTimes", JSON.stringify(updatedTimes));
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


  const silenceAlarmForSensor = (sensor) => {
    const alarmKey = `${sensor.replace("Sensor", "Alarm")}`;
    setActiveAlarms((prev) => {
      const newAlarms = { ...prev, [alarmKey]: false };
      localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
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

  const silenceAlarm = (alarm) => {
    if (user?.isAdmin) {
      setActiveAlarms((prev) => {
        const newAlarms = { ...prev, [alarm]: false };
        localStorage.setItem("activeAlarms", JSON.stringify(newAlarms));
        return newAlarms;
      });
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
      {!isSidebarCollapsed && (
        <p className="last-triggered-text">
          Last Triggered: {lastTriggeredTimes[alarm]}
        </p>
      )}
    </div>
  );

  useEffect(() => {
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
      </main>
    </div>
  );
}
