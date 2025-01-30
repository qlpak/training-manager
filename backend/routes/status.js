const express = require("express");
const { updateTrainingStatus } = require("../controllers/statusController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.put("/:id", verifyToken, updateTrainingStatus);

module.exports = router;
