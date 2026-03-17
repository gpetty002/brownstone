// Site.js

const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
  name: String,
  apiKey: String,
  license: {
    model: String,      // free | paid
    rate: String,       // e.g. "$0.001-per-1000-tokens"
    permission: String, // allowed | restricted | blocked
  },
  enforcementEnabled: Boolean,
  blockedAIs: [String],
  webhookUrl: String,
  domain: String,
});

module.exports = mongoose.model("Site", siteSchema);
