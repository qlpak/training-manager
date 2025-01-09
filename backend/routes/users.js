const express = require("express");
const {
  getAllUsers,
  createUser,
  searchUsers,
  updateUserRole,
} = require("../controllers/usersController");
const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/search", searchUsers);
router.put("/:id/role", updateUserRole);
router.put("/:id/role", verifyToken, authorize("admin"), updateUserRole);

module.exports = router;
