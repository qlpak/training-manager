const { User } = require("../models");
const { Op } = require("sequelize");

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required..." });
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
    const { name, email, password, role } = req.body;

    console.log("Request body:", req.body);

    if (role && !["admin", "coach", "athlete"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const newUser = await User.create({ name, email, password, role });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      // this error seemed odd but it told me that the email must be unique so i put it here so it is more clear
      return res.status(400).json({ error: "Email must be unique" });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user", details: error });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "coach", "athlete"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role! Try something more ordinary;D" });
    }

    const updatedUser = await User.update(
      { role },
      { where: { id }, returning: true }
    );

    if (!updatedUser[1][0]) {
      return res.status(404).json({ error: "User was not found;-(" });
    }

    res.json(updatedUser[1][0]);
  } catch (error) {
    console.error("Error updating user role:", error.message);
    res.status(500).json({ error: "Failed to update user role;" });
  }
};
