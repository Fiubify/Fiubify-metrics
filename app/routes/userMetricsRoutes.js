const express = require("express");
const router = express.Router();

const userMetricsController = require("../controllers/userMetricsController");

router.get("/events", userMetricsController.getAllUsersEvents);
router.post("/events", userMetricsController.createNewUserEvent);

module.exports = router;
