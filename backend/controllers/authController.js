const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { setUserStatus } = require("../mqtt/statusHandler");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "admin@admin") {
      if (password !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }

      const token = jwt.sign(
        { id: 0, email: "admin@admin", role: "admin", name: "Administrator" },
        process.env.JWT_SECRET,
        { expiresIn: "99999h" }
      );

      setUserStatus(0, "Online");

      return res.json({ token });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "99999h" }
    );

    setUserStatus(user.id, "Online");

    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Failed to log in" });
  }
};

exports.logout = (req, res) => {
  try {
    const { id } = req.user;
    console.log(`Publishing Offline status for user ${id}`);
    setUserStatus(id, "Offline");
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ error: "Failed to log out" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    if (!["coach", "athlete"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role. Try something more ordinary.." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "9999h" }
    );

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Failed to register user" });
  }
};
