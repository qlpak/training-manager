const express = require("express");
const usersRoutes = require("./users");
const plansRoutes = require("./plans");
const progressRoutes = require("./progress");
const reviewsRoutes = require("./reviews");
const statusRoutes = require("./status");

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/plans", plansRoutes);

router.use("/progress", progressRoutes);

router.use("/reviews", reviewsRoutes);

router.use("/status", statusRoutes);

module.exports = router;
