const ApiError = require("../errors/apiError");
const QueryParser = require("../utils/queryParser");
const ContentEvent = require("../models/contentEvent");

const getAllContentEvents = async (req, res, next) => {
  const queryParams = ["action", "genre", "tier", "user", "album", "song"];

  const queryParser = new QueryParser(queryParams, []);
  const query = queryParser.parseRequest(req);

  try {
    const filteredEvents = await ContentEvent.find(query).select("-_id");
    if (!filteredEvents.length && Object.keys(query).length !== 0) {
      const message = queryParser.getErrorMessageNotFound(req);
      next(ApiError.resourceNotFound(message));
    } else {
      res.status(200).json({
        data: filteredEvents,
      });
    }
  } catch (err) {
    next(ApiError.internalError("Internal error when getting songs"));
    return;
  }
};

const createNewContentEvent = async (req, res, next) => {
  const { action, tier, genre, user, album, song } = req.body;

  try {
    const newEvent = new ContentEvent({
      action: action,
      tier: tier,
      genre: genre,
      user: user,
      album: album,
      song: song,
    });

    await newEvent.save();
    res.status(201).send({});
  } catch (err) {
    next(ApiError.invalidArguments(`Invalid arguments passed`));
    return;
  }
};

module.exports = { getAllContentEvents, createNewContentEvent };