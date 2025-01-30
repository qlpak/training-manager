const { Review } = require("../models");

exports.createReview = async (req, res) => {
  try {
    const { rating, comment, plan_id } = req.body;
    const user_id = req.user.id;

    if (!rating || !plan_id) {
      return res
        .status(400)
        .json({ error: "Rating and plan_id are required." });
    }

    const review = await Review.create({ rating, comment, user_id, plan_id });
    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
};

exports.getReviewsByPlan = async (req, res) => {
  try {
    const { plan_id } = req.params;
    const reviews = await Review.findAll({ where: { plan_id } });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    const review = await Review.findByPk(id);
    if (!review || review.user_id !== user_id) {
      return res.status(404).json({ error: "Unauthorized" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    const updatedReview = await Review.findByPk(id);

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: "Failed to update review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const review = await Review.findByPk(id);
    if (!review || review.user_id !== user_id) {
      return res.status(404).json({ error: "Unauthorized" });
    }

    await review.destroy();
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};
