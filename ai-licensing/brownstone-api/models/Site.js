// Site.js

const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  apiKey: { type: String, unique: true },
  license: {
    model: String,      // free | paid
    rate: String,       // e.g. "$0.001-per-1000-tokens"
    permission: String, // allowed | restricted | blocked
  },
  enforcementEnabled: Boolean,
  blockedAIs: [String],
  webhookUrl: String,
  domain: { type: String, unique: true, sparse: true },
});

module.exports = mongoose.model("Site", siteSchema);
