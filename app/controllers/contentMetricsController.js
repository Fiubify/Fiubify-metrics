const ApiError = require("../errors/apiError");
const QueryParser = require("../utils/queryParser");
const ContentEvent = require("../models/contentEvent");

const getAllContentEvents = async (req, res, next) => {
    const queryParams = ["action", "genre", "tier", "userUId", "albumId", "albumName", "songId", "songName"];

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
    }
};

const createNewContentEvent = async (req, res, next) => {
    const {action, tier, genre, userUId, albumId, albumName, songId, songName} = req.body;

    try {
        const newEvent = new ContentEvent({
            action: action,
            tier: tier,
            genre: genre,
            userUId: userUId,
            albumId: albumId,
            albumName: albumName,
            songId: songId,
            songName: songName,
        });

        await newEvent.save();
        res.status(201).send({});
    } catch (err) {
        next(ApiError.invalidArguments(`Invalid arguments passed`));
    }
};


const aggregateBySong = async (req, res, next) => {
    try {
        const result = await ContentEvent.aggregate([
            {
                $match:
                    {action: "Listened"}
            },
            {
                $group:
                    {
                        _id: {songId: "$songId", songName: "$songName"},
                        count: {$sum: 1}
                    }
            },
            {
                $sort: {count: -1}
            }]);
        res.status(200).json({
            data: result,
        });
    } catch (e) {
        console.error(e)
        next(ApiError.internalError("Internal error when aggregating songs by title"));
    }
};

module.exports = {getAllContentEvents, createNewContentEvent, aggregateBySong};
