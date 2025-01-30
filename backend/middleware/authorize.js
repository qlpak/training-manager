module.exports = (role) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (role.includes(userRole)) {
        return next();
      }

      return res.status(403).json({ error: "Forbidden" });
    } catch (error) {
      console.error("Authorization error:", error.message);
      res.status(403).json({ error: "Forbidden" });
    }
  };
};
