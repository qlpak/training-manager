module.exports = (requiredRole) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      if (userRole !== requiredRole) {
        return res
          .status(403)
          .json({ error: "Access denied. Insufficient permissions." });
      }
      next(); // can continue if the user has 'acceptable' role
    } catch (error) {
      console.error("Authorization error:", error.message);
      res.status(500).json({ error: "Failed to authorize user" });
    }
  };
};
