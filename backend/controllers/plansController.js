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
    const { name, description, duration, intensity, userId } = req.body;

    if (!name || !description || !duration || !userId || intensity === null) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newPlan = await Plan.create({
      name,
      description,
      duration,
      intensity,
      user_id: userId,
    });
    res
      .status(201)
      .json({ message: "Plan created successfully", plan: newPlan });
  } catch (error) {
    console.error("Error creating plan:", error.message);
    res.status(500).json({ error: "Failed to create plan;(" });
  }
};

const { client: mqttClient, setUserStatus } = require("../mqtt/mqttClient");

exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, intensity } = req.body;

    console.log("🔄 Updating plan:", {
      id,
      name,
      description,
      duration,
      intensity,
    });

    if (!name || !description || !duration || intensity === null) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    if (intensity < 0 || intensity > 10) {
      return res
        .status(400)
        .json({ error: "Intensity must be between 0 and 10!" });
    }

    const existingPlan = await Plan.findByPk(id);
    if (!existingPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    await Plan.update(
      { name, description, duration, intensity },
      { where: { id } }
    );

    console.log(`Plan ID ${id} updated successfully.`);

    if (mqttClient && mqttClient.connected) {
      mqttClient.publish(
        `notifications/${existingPlan.user_id}`,
        JSON.stringify({
          message: `Your training plan "${name}" has been updated.`,
          timestamp: new Date().toISOString(),
        }),
        (err) => {
          if (err) {
            console.error("MQTT publish error:", err);
          } else {
            console.log(`Notification sent to user ${existingPlan.user_id}`);
          }
        }
      );
    } else {
      console.warn("⚠️ MQTT client is not connected.");
    }

    res.json({ message: "Plan updated successfully" });
  } catch (error) {
    console.error("Error updating plan:", error.message);
    res.status(500).json({ error: "Failed to update plan. Please try again." });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPlan = await Plan.findByPk(id);
    if (!existingPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    await Plan.destroy({ where: { id } });

    console.log(`✅ Plan with ID ${id} deleted successfully.`);

    if (mqttClient && mqttClient.connected) {
      mqttClient.publish(
        `notifications/${existingPlan.user_id}`,
        JSON.stringify({
          message: `Your training plan "${existingPlan.name}" has been deleted.`,
          timestamp: new Date().toISOString(),
        }),
        (err) => {
          if (err) {
            console.error("MQTT publish error:", err);
          } else {
            console.log(`Notification sent to user ${existingPlan.user_id}`);
          }
        }
      );
    } else {
      console.warn("MQTT client is not connected.");
    }

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error.message);
    res.status(500).json({ error: "Failed to delete plan. Please try again." });
  }
};

exports.searchPlans = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Search query:", query);
    console.log("Authenticated user:", req.user);

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
    res.status(500).json({ error: "Failed to search plans." });
  }
};

exports.getPlansByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const plans = await Plan.findAll({
      where: { user_id: id },
      attributes: [
        "id",
        "name",
        "description",
        "duration",
        "intensity",
        "user_id",
      ],
    });

    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error.message);
    res.status(500).json({ error: "Failed to fetch plans..;[" });
  }
};
