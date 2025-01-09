const express = require("express");
const {
  getAllUsers,
  createUser,
  searchUsers,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/search", searchUsers);

module.exports = router;
