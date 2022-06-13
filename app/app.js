const express = require("express");

// Initialize global services
require("./services/db");

// Middlewares import
const errorHandlerMiddleware = require("./middleware/errorHandler");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());


// Example route
app.get("/", (req, res) => {
  res.send("Initial setup");
});

// Error handling middlewares
app.use(errorHandlerMiddleware);

module.exports = app;
