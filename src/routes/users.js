const express = require("express");
const requireAdmin = require("../middlewares/requireAdmin");
const { getAll, getOne } = require("../controllers/users");

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/create", requireAdmin, (req, res) => {
  res.json(req.body);
});

module.exports = router;
