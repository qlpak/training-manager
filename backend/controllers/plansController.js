const { Plan } = require("../models");

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error.message);
    res.status(500).json({ error: "Failed to fetch plans ;/" });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const { name, description, duration } = req.body;
    const newPlan = await Plan.create({ name, description, duration });
    res.status(201).json(newPlan);
  } catch (error) {
    console.error("Error creating plan:", error.message);
    res.status(500).json({ error: "Failed to create plan;(" });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration } = req.body;
    const updatedPlan = await Plan.update(
      { name, description, duration },
      { where: { id }, returning: true }
    );
    if (!updatedPlan[1][0]) {
      return res.status(404).json({ error: "Plan was not found" });
    }
    res.json(updatedPlan[1][0]);
  } catch (error) {
    console.error("Error updating plan:", error.message);
    res.status(500).json({ error: "Failed to update plan ;/" });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Plan.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error.message);
    res.status(500).json({ error: "Failed to delete plan;/" });
  }
};
