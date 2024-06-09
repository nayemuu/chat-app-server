const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User", // This User is reffering your User Model
      required: true
    },

    participant: {
      type: mongoose.Types.ObjectId,
      ref: "User", // This User is reffering your User Model
      required: true
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
