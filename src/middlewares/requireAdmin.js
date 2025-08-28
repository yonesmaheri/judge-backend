const jwt = require('jsonwebtoken');

module.exports = function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
