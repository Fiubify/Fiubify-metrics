const express = require("express");
const router = express.Router();

const contentMetricsController = require("../controllers/contentMetricsController");

router.get("/events", contentMetricsController.getAllContentEvents);
router.post("/events", contentMetricsController.createNewContentEvent);

module.exports = router;
