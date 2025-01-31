const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mqtt = require("mqtt");
const { User } = require("./models");
const { setupRankingWebSocket } = require("./mqtt/ranking");

const statusRoutes = require("./routes/status");
const reviewsRoutes = require("./routes/reviews");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint was not found" });
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
  allowEIO3: true,
});

setupRankingWebSocket(io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join room", async ({ roomId, username }) => {
    socket.join(roomId);
    socket.username = username;
    console.log(
      `Client ${socket.id} joined room ${roomId} as ${socket.username}`
    );
  });

  socket.on("chat message", ({ roomId, username, message }) => {
    console.log(`Received message from ${username}: ${message}`);
    if (!username || !message) return;
    io.to(roomId).emit("chat message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const mqttClient = mqtt.connect("ws://broker.hivemq.com:8000/mqtt", {
  protocol: "ws",
  clientId: `backend_${Math.random().toString(16).substr(2, 8)}`,
  clean: false,
  keepalive: 60,
  reconnectPeriod: 5000,
  connectTimeout: 10000,
  will: {
    topic: "users/default/status",
    payload: "Offline",
    retain: true,
  },
});

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("progress/+/calories");
  mqttClient.subscribe("users/+/status");
  mqttClient.subscribe("progress/+/heart-rate");
  mqttClient.publish("users/all/status", "Online", { retain: true });
});

mqttClient.on("message", (topic, message) => {
  if (topic.startsWith("progress/")) {
    const athleteId = topic.split("/")[1];

    if (topic.endsWith("/calories")) {
      const caloriesBurned = parseInt(message.toString(), 10);
      io.emit("updateRanking", { athleteId, calories: caloriesBurned });
    }
  }
});

mqttClient.on("message", (topic, message) => {
  if (topic.startsWith("progress/")) {
    const athleteId = topic.split("/")[1];

    if (topic.endsWith("/calories")) {
      const caloriesBurned = parseInt(message.toString(), 10);
      io.emit("updateRanking", { athleteId, calories: caloriesBurned });
    }

    if (topic.endsWith("/heart-rate")) {
      const heartRateData = JSON.parse(message.toString());
      io.emit("heart-rate", { athleteId, ...heartRateData });
      console.log(
        `Emitted heart rate for athlete ID ${athleteId}:`,
        heartRateData
      );
    }
  }
});

mqttClient.on("error", (err) => {
  console.error("MQTT connection error:", err.message);
});

mqttClient.on("reconnect", () => {
  console.log("MQTT client reconnecting...");
});

mqttClient.on("offline", () => {
  console.warn("⚠️ MQTT client is offline");
});

app.use("/api/status", statusRoutes);
app.use("/api/reviews", reviewsRoutes);

server.listen(3000, () => {
  console.log("HTTP server running on port 3000");
});

module.exports = { app, server, io };
