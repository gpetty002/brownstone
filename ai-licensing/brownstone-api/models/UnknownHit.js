// UnknownHit.js

const mongoose = require("mongoose");

const unknownHitSchema = new mongoose.Schema({
  siteId: mongoose.Schema.Types.ObjectId,
  userAgent: String,
  path: String,
  ip: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UnknownHit", unknownHitSchema);
