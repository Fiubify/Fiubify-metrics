const ApiError = require("../errors/apiError");
const QueryParser = require("../utils/queryParser");
const UserEvent = require("../models/userEvent");

const getAllUsersEvents = async (req, res, next) => {
  const queryParams = ["action", "type"];

  const queryParser = new QueryParser(queryParams, []);
  const query = queryParser.parseRequest(req);

  try {
    const filteredEvents = await UserEvent.find(query).select("-_id");
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

const createNewUserEvent = async (req, res, next) => {
  const { action, type } = req.body;

  try {
    const newEvent = new UserEvent({
      action: action,
      type: type,
    });

    await newEvent.save();
    res.status(201).send({});
  } catch (err) {
    next(ApiError.invalidArguments(`Invalid arguments passed`));
    return;
  }
};

module.exports = {
  getAllUsersEvents,
  createNewUserEvent,
};
