module.exports = (role) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      const userId = req.user.id;
      const requestedId = parseInt(req.params.id);

      if (userRole === "athlete" && userId !== requestedId) {
        return res.status(403).json({ error: "Forbidden" });
      }

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
