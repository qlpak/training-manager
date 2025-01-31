const { mqttClient } = require("./mqttClient");

const publishHeartRate = (athleteId, heartRate) => {
  const topic = `progress/${athleteId}/heart-rate`;
  mqttClient.publish(
    topic,
    JSON.stringify({ heartRate, timestamp: new Date().toISOString() }),
    { retain: false }
  );
  console.log(`Published HR for athlete ${athleteId}:`, heartRate);
};

const generateFakeHeartRate = () => {
  setInterval(() => {
    const athletes = [
      "4",
      "6",
      "9",
      "10",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
    ];
    athletes.forEach((athleteId) => {
      const heartRate = Math.floor(Math.random() * (180 - 60 + 1)) + 60;
      publishHeartRate(athleteId, heartRate);
    });
  }, 5000);
};

generateFakeHeartRate();

module.exports = { publishHeartRate };
