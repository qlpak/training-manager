const express = require("express");
const {
  createReview,
  getReviewsByPlan,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/:plan_id", getReviewsByPlan);
router.put("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

module.exports = router;
