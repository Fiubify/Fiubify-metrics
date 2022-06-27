const mongoose = require("mongoose");

const contentEvent = mongoose.Schema({
        action: {
            type: String,
            enum: ["Creation", "Listened"],
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        tier: {
            type: String,
            required: true,
        },
        userUId: {
            type: String,
            required: true,
        },
        songId: {
            type: String,
            required: true,
        },
        songName: {
            type: String,
            required: true,
        },
        albumId: {
            type: String,
            required: true,
        },
        albumName: {
            type: String,
            required: true,
        },
    },
    {timestamps: {createdAt: true, updatedAt: false}}
);

module.exports = mongoose.model("ContentEvent", contentEvent);
