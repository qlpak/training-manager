const express = require("express");
const usersRoutes = require("./users");
const plansRoutes = require("./plans");

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/plans", plansRoutes);

module.exports = router;
