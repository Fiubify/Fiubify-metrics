const express = require("express");
const router = express.Router();

const contentMetricsController = require("../controllers/contentMetricsController");

router.get("/events", contentMetricsController.getAllContentEvents);
router.get("/events/agg_by_song", contentMetricsController.aggregateBySongsListened);
router.get("/events/agg_by_album", contentMetricsController.aggregateByAlbumsListened);
router.post("/events", contentMetricsController.createNewContentEvent);

module.exports = router;
