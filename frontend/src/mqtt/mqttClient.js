import mqtt from "mqtt";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");
let userId = null;

if (token) {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    userId = decodedToken.id;
  } catch (error) {
    console.error("Invalid token:", error);
  }
}

const mqttClient = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", {
  protocol: "wss",
  clientId: `frontend_${Math.random().toString(16).substr(2, 8)}`,
  clean: false,
  keepalive: 60,
  reconnectPeriod: 5000,
});

mqttClient.on("connect", () => {
  console.log("Frontend MQTT client connected");

  if (userId) {
    mqttClient.subscribe(`notifications/${userId}`, (err) => {
      if (!err) {
        console.log(`Subscribed to notifications/${userId}`);
      }
    });
  }
});

mqttClient.on("message", (topic, message) => {
  console.log(`Received MQTT message on ${topic}:`, message.toString());
});

export const disconnectMqtt = () => {
  mqttClient.end();
  console.log("MQTT disconnected (Frontend)");
};

export default mqttClient;
