const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String }, // text or emoji
  messageType: {
    type: String,
    enum: ["text", "emoji", "image", "voice"],
    required: true
  },
  mediaUrl: { type: String }, // image/voice note URL if needed
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
