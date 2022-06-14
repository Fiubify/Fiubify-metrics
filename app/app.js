const express = require("express");

// Initialize global services
require("./services/db");

// Middlewares import
const errorHandlerMiddleware = require("./middleware/errorHandler");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());

// Routes import
const userMetricsRoutes = require("./routes/userMetricsRoutes");
const contentMetricsRoutes = require("./routes/contentMetricsRoutes");

app.use("/users", userMetricsRoutes);
app.use("/contents", contentMetricsRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Initial setup");
});

// Error handling middlewares
app.use(errorHandlerMiddleware);

module.exports = app;
