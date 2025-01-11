const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint was not found" });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join room", (roomId) => {
    console.log(`Client ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("chat message", ({ roomId, username, message }) => {
    console.log(`Message in room ${roomId} from ${username}: ${message}`);
    io.to(roomId).emit("chat message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
