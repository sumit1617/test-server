const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/error.js");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1,
  delayMs: () => 10000,
});

// app.use(speedLimiter);
// app.use(limiter);
app.use(express.json());

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: "500mb",
  })
);
app.use(bodyParser.json());

// Route Imports
const user = require("./routes/userRoutes");

app.use("/api/v1", user);

// Middleware for errors
app.use(errorMiddleware);
module.exports = app;
