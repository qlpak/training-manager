const { mqttClient } = require("./mqttClient");

const setUserStatus = (userId, status) => {
  if (!userId) {
    console.error("setUserStatus: userId is required!");
    return;
  }

  const topic = `users/${userId}/status`;

  console.log(`Updating status for user ${userId}: ${status}`);
  mqttClient.publish(topic, status, { retain: true }, (err) => {
    if (err) {
      console.error("Failed to update user status:", err);
    } else {
      console.log(`User ${userId} status set to ${status}`);
    }
  });
};

module.exports = { setUserStatus };
