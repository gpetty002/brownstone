// unknownHits.js

const express = require("express");
const router = express.Router();
const Site = require("../models/Site");
const UnknownHit = require("../models/UnknownHit");

const BROWSER_SIGNALS = ["Chrome/", "Firefox/", "Safari/", "Edge/", "MSIE", "Trident/", "Opera/"];

function looksLikeBrowser(ua) {
  return BROWSER_SIGNALS.some((signal) => ua.includes(signal));
}

// POST /unknown-hit — log an unrecognized bot
router.post("/", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const { userAgent, path, ip } = req.body;

  if (!userAgent) return res.json({ skipped: true });

  const site = await Site.findOne({ apiKey });
  if (!site) return res.status(401).json({ error: "Invalid API key" });

  if (looksLikeBrowser(userAgent)) return res.json({ skipped: true });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const exists = await UnknownHit.findOne({ siteId: site._id, userAgent, timestamp: { $gte: since } });
  if (exists) return res.json({ skipped: true });

  await UnknownHit.create({ siteId: site._id, userAgent, path, ip });

  res.json({ success: true });
});

// GET /sites/:id/unknown-hits — fetch unknown hits for a site
router.get("/:id/unknown-hits", async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Site not found" });
  if (site.apiKey !== apiKey) return res.status(401).json({ error: "Invalid API key" });

  const hits = await UnknownHit.find({ siteId: site._id }).sort({ timestamp: -1 });

  res.json({ siteId: site._id, name: site.name, unknownHits: hits });
});

module.exports = router;
