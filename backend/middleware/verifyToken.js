const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // expected header: "Authorization: Bearer <token>"
    if (!token) {
      return res
        .status(401)
        .json({ error: "Authentication token missing !!!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res
      .status(401)
      .json({ error: "Invalid or expired token;( Try again agent!" });
  }
};
