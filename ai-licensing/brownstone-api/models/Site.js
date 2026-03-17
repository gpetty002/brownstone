// Site.js

const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
  name: String,
  apiKey: String,
  license: {
    model: String, // free | paid
    rate: String,
  },
  enforcementEnabled: Boolean,
  blockedAIs: [String],
});

module.exports = mongoose.model("Site", siteSchema);
