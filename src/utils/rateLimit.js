const rateLimit = require('express-rate-limit');

exports.adminLoginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 دقیقه
  max: 5,              // حداکثر ۵ درخواست در دقیقه از هر IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again later.' },
});
