const express = require("express");
const { register, login} = require("../controllers/auth");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, (req, res) => {  
  res.json(req.user);
});
module.exports = router;