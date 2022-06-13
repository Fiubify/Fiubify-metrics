const mongoose = require("mongoose");

const userEventSchema = mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["Login", "Signup"],
      required: true,
    },

    type: {
      type: String,
      enum: ["Federated", "Email"],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("UserEvent", userEventSchema);
