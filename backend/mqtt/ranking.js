const { mqttClient } = require("./mqttClient");
const { User } = require("../models");

const athleteCalories = {};
let io;

const calculateRanking = async () => {
  try {
    const users = await User.findAll({
      where: { role: "athlete" },
      attributes: ["id"],
    });
    const userIds = users.map((user) => user.id.toString());

    return Object.entries(athleteCalories)
      .filter(([athleteId]) => userIds.includes(athleteId))
      .map(([athleteId, calories]) => ({ athleteId, calories }))
      .sort((a, b) => b.calories - a.calories);
  } catch (error) {
    console.error("Error fetching users from database:", error);
    return [];
  }
};

mqttClient.on("connect", () => {
  console.log("Subscribed to athlete status & calorie topics");
  mqttClient.subscribe("users/+/status");
  mqttClient.subscribe("progress/+/calories");
});

mqttClient.on("message", async (topic, message) => {
  if (topic.startsWith("progress/") && topic.endsWith("/calories")) {
    const athleteId = topic.split("/")[1];
    const caloriesBurned = parseInt(message.toString(), 10);

    if (!athleteCalories[athleteId]) {
      athleteCalories[athleteId] = 0;
    }

    athleteCalories[athleteId] += caloriesBurned;

    const ranking = await calculateRanking();

    if (!Array.isArray(ranking)) {
      console.error("Error: ranking is not an array", ranking);
      return;
    }

    if (io) {
      io.emit("updateRanking", ranking);
      console.log("Ranking updated and sent to WebSocket", ranking);
    }
  }
});

const setupRankingWebSocket = (socketIoInstance) => {
  io = socketIoInstance;
  console.log("Ranking WebSocket setup completed.");
};

module.exports = { setupRankingWebSocket };
