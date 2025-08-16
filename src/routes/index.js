const express = require("express");
const router = express.Router();

const authRoute = require('./auth')
const questionsRouter = require("./questions");

router.use("/auth", authRoute);
router.use("/questions", questionsRouter);

module.exports = router;