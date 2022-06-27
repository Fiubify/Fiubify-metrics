const mongoose = require("mongoose");

const userEventSchema = mongoose.Schema(
    {
        action: {
            type: String,
            enum: ["Login", "Signup", "Password"],
            required: true,
        },
        type: {
            type: String,
            enum: ["Federated", "Email", "Reset"],
        },
        userUId: {
            type: String,
            required: true,
        },
    },
    {timestamps: {createdAt: true, updatedAt: false}}
);

module.exports = mongoose.model("UserEvent", userEventSchema);
