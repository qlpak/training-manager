const express = require("express");
const { publishProgress } = require("../mqtt/progressHandler");

const router = express.Router();

router.post("/", (req, res) => {
  const { athleteId, data } = req.body;

  if (!athleteId || !data) {
    return res.status(400).json({ error: "athleteId and data are required" });
  }

  publishProgress(athleteId, data);
  res.status(200).json({ message: "Progress data published successfully" });
});

module.exports = router;
