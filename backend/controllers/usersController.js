const { User } = require("../models");
const { Op } = require("sequelize");

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).json({ error: "Failed to search users;/" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    console.log("Fetching users...");
    const users = await User.findAll();
    console.log("Fetched users:", users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users ;(" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user :/" });
  }
};
