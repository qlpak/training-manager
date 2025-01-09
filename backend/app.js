const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const authRoutes = require("./routes/auth");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint was not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
