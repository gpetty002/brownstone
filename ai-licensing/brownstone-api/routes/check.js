// check.js

const express = require("express");
const router = express.Router();
const Site = require("../models/Site");

router.post("/", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const { ai } = req.body;

  const site = await Site.findOne({ apiKey });
  if (!site) return res.status(401).json({ error: "Invalid API key" });

  if (!site.enforcementEnabled) {
    return res.json({ allowed: true });
  }

  if (site.blockedAIs.includes(ai)) {
    return res.json({ allowed: false });
  }

  res.json({ allowed: true });
});

module.exports = router;
