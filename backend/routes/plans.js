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
router.post("/", createPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);
router.get("/search", searchPlans);

router.get(
  "/user/:id",
  verifyToken,
  authorize(["athlete", "coach"]),
  getPlansByUser
);

router.post("/", verifyToken, authorize(["coach"]), createPlan);

module.exports = router;
