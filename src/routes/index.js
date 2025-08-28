const express = require("express");
const router = express.Router();

const authRoute = require('./auth')
const questionsRouter = require("./questions");
const adminRouter = require("./admin");

router.use("/auth", authRoute);
router.use("/questions", questionsRouter);
router.use("/admin", );

module.exports = router;