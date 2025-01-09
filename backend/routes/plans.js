const express = require("express");
const {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  searchPlans,
} = require("../controllers/plansController");

const router = express.Router();

router.get("/", getAllPlans);
router.post("/", createPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);
router.get("/search", searchPlans);

module.exports = router;
