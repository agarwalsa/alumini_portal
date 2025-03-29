const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    coverPhoto: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: String,
    likes: { type: Number, default: 0 },
    comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, comment: String, date: { type: Date, default: Date.now } }],
    date: { type: Date, default: Date.now },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  });
  module.exports = mongoose.model("Blog",blogSchema);
  