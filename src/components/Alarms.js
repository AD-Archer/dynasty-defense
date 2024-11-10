// Add this to all floor dashboard files
function createAlarm(sensorType, floorNumber) {
  const currentTime = new Date().toLocaleString();
  const logs = JSON.parse(localStorage.getItem("sensorLogs") || "[]");

  // Add new log entry
  logs.push({
    type: sensorType,
    floor: floorNumber,
    dateTime: currentTime,
  });

  localStorage.setItem("sensorLogs", JSON.stringify(logs));

  // Optional: Add sound alert
  const audio = new Audio("path_to_alarm_sound.mp3");
  audio.play();

  // Optional: Show browser notification
  if (Notification.permission === "granted") {
    new Notification(`Floor ${floorNumber} Alert`, {
      body: `${sensorType} sensor triggered at ${currentTime}`,
      icon: "path_to_icon.png",
    });
  }
}

// Modify setRandomStatus function to include alarm creation
function setRandomStatus(sensorId, storageKey, sensorType, floorNumber) {
  const isProblem = Math.random() < 0.2;
  const status = isProblem ? "red" : "green";

  document.getElementById(sensorId).className = "status-indicator " + status;
  localStorage.setItem(storageKey, status);

  if (isProblem) {
    createAlarm(sensorType, floorNumber);
  }
}
