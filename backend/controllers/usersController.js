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
    const { role } = req.query;

    const whereClause = role ? { role } : {};

    const users = await User.findAll({
      where: whereClause,
      attributes: ["id", "name", "email", "role"],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users;-[" });
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

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res
      .status(200)
      .json({ message: "User deleted successfully. No more fake people!" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["athlete", "coach"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role. Maybe try somethin more normal" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error.message);
    res.status(500).json({ error: "Failed to update user role;(" });
  }
};
