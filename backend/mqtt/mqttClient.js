const mqtt = require("mqtt");

const activeUsers = new Set();

const mqttClient = mqtt.connect("mqtts://broker.hivemq.com:8883", {
  protocol: "mqtts",
  clientId: `backend_${Math.random().toString(16).substr(2, 8)}`,
  clean: true,
  keepalive: 60,
  reconnectPeriod: 5000,
  connectTimeout: 10000,
});

mqttClient.on("connect", () => {
  console.log("MQTT client connected (Backend)");
  mqttClient.subscribe("users/+/status");
  mqttClient.subscribe("progress/+/calories");
  mqttClient.subscribe("progress/+/heart-rate");
  generateRandomCalories();
});

mqttClient.on("message", (topic, message) => {
  if (topic.startsWith("users/") && topic.endsWith("/status")) {
    const userId = topic.split("/")[1];
    const status = message.toString();

    if (status === "Online") {
      activeUsers.add(userId);
    } else {
      activeUsers.delete(userId);
    }
  }
});

const generateRandomCalories = () => {
  setInterval(() => {
    const users = [...activeUsers];
    if (users.length === 0) return;

    users.forEach((userId) => {
      const randomCalories = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
      const topic = `progress/${userId}/calories`;

      mqttClient.publish(topic, JSON.stringify(randomCalories), {
        retain: false,
      });
      console.log(`Wygenerowano dane: ${userId} spalił ${randomCalories} kcal`);
    });
  }, 5000);
};

module.exports = {
  mqttClient,
  getActiveUsers: () => [...activeUsers],
};
