// Usage.js

const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  siteId: mongoose.Schema.Types.ObjectId,
  aiProvider: String,
  path: String,
  ip: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Usage", usageSchema);
