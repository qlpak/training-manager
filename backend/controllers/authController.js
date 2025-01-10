const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password'(" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: "Failed to log in.;(" });
  }
};
console.log("JWT_SECRET:", process.env.JWT_SECRET); // debug: to see whether the jwt token is loaded correctly

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "athlete",
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Failed to register user.. try again!" });
  }
};
