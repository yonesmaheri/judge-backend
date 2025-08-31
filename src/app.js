const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();
// Require Route
const route = require("./routes");

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://yonesma.ir",
  "https://www.yonesma.ir",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Route
app.use("/api", route);

module.exports = app;
