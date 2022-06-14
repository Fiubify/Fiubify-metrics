const mongoose = require("mongoose");

const contentEvent = mongoose.Schema(
  {
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

    user: {
      type: String,
    },

    song: {
      type: String,
      required: true,
    },

    album: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("ContentEvent", contentEvent);