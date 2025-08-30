const express = require("express");
const router = express.Router();

const authRoute = require("./auth");
const questionsRouter = require("./questions");
const adminRouter = require("./admin");
const userRouter = require("./users");

router.use("/auth", authRoute);
router.use("/questions", questionsRouter);
router.use("/admin", adminRouter);
router.use("/users", userRouter);

module.exports = router;
