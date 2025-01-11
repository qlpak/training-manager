const { Plan } = require("../models");
const { Op } = require("sequelize");

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
    const { name, description, duration, id } = req.body;

    if (!name || !description || !duration || !id) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newPlan = await Plan.create({
      name,
      description,
      duration,
      user_id: id,
    });
    res
      .status(201)
      .json({ message: "Plan created successfully", plan: newPlan });
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

exports.searchPlans = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const plans = await Plan.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });

    res.json(plans);
  } catch (error) {
    console.error("Error searching plans:", error.message);
    res.status(500).json({ error: "Failed to search plans;(" });
  }
};
exports.getPlansByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const plans = await Plan.findAll({
      where: { user_id: id },
      attributes: ["id", "name", "description", "duration"],
    });

    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error.message);
    res.status(500).json({ error: "Failed to fetch plans..;[" });
  }
};
