const { mqttClient, getActiveUsers } = require("./mqttClient");

const athleteCalories = {};
let io;

const calculateRanking = () => {
  const activeUsers = getActiveUsers();
  return Object.entries(athleteCalories)
    .filter(([athleteId]) => activeUsers.includes(athleteId))
    .map(([athleteId, calories]) => ({ athleteId, calories }))
    .sort((a, b) => b.calories - a.calories);
};

mqttClient.on("connect", () => {
  console.log("Subscribed to athlete status & calorie topics");
  mqttClient.subscribe("users/+/status");
  mqttClient.subscribe("progress/+/calories");
});

mqttClient.on("message", (topic, message) => {
  if (topic.startsWith("progress/") && topic.endsWith("/calories")) {
    const athleteId = topic.split("/")[1];
    const caloriesBurned = parseInt(message.toString(), 10);

    if (!athleteCalories[athleteId]) {
      athleteCalories[athleteId] = 0;
    }

    athleteCalories[athleteId] += caloriesBurned;

    const ranking = calculateRanking();

    if (!Array.isArray(ranking)) {
      console.error("error: is not array", ranking);
      return;
    }

    if (io) {
      io.emit("updateRanking", ranking);
      console.log("ranking updated and send to websocket", ranking);
    }
  }
});

const setupRankingWebSocket = (socketIoInstance) => {
  io = socketIoInstance;
  console.log("Ranking WebSocket setup completed.");
};

module.exports = { setupRankingWebSocket };
