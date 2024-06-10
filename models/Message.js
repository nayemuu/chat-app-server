const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
      type: String,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User", // This User is reffering your User Model
      required: true
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User", // This User is reffering your User Model
      required: true
    },
    conversation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
