const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();
// Require Route
const route = require('./routes')

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://yonesma.ir",
  "https://www.yonesma.ir"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Route
app.use("/api", route);

module.exports = app;
