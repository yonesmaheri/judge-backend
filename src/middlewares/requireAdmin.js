const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
  try {
    const token = req.headers?.authorization.split(" ")[1];
    console.log(token);

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = requireAdmin;
