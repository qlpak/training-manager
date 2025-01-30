const express = require("express");
const { login, register, logout } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", verifyToken, logout);

module.exports = router;
