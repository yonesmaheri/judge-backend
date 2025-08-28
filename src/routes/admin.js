const express = require("express");
const { login, logout } = require("../controllers/admin");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.get("/me", requireAdmin, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
