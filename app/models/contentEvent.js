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
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("ContentEvent", contentEvent);
