const express = require("express");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

router.get("/me", requireAdmin, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
