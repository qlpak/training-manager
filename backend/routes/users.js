const express = require("express");
const {
  getAllUsers,
  createUser,
  searchUsers,
  updateUserRole,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/search", searchUsers);
router.put("/:id/role", updateUserRole);

module.exports = router;
