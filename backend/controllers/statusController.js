const { Plan } = require("../models");

exports.updateTrainingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Planned", "In Progress", "Finished", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    plan.status = status;
    await plan.save();

    res.json({ message: "Training status updated", plan });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
