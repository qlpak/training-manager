const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorize");
const {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  searchPlans,
  getPlansByUser,
} = require("../controllers/plansController");

const router = express.Router();

router.get("/", getAllPlans);
router.post("/", verifyToken, createPlan);
router.put("/:id", verifyToken, updatePlan);
router.delete("/:id", verifyToken, deletePlan);
router.get(
  "/search",
  verifyToken,
  authorize(["coach", "athlete"]),
  searchPlans
);

router.get(
  "/user/:id",
  verifyToken,
  authorize(["athlete", "coach"]),
  getPlansByUser
);
router.put("/:id", verifyToken, authorize(["coach"]), updatePlan);

router.delete("/:id", verifyToken, authorize(["coach"]), deletePlan);

module.exports = router;
