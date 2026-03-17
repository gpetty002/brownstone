// usage.js

const express = require("express");
const router = express.Router();
const Site = require("../models/Site");
const Usage = require("../models/Usage");

// GET /sites/:id/usage — fetch usage logs for a site
router.get("/:id/usage", async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Site not found" });
  if (site.apiKey !== apiKey) return res.status(401).json({ error: "Invalid API key" });

  const logs = await Usage.find({ siteId: site._id }).sort({ timestamp: -1 });

  res.json({ siteId: site._id, name: site.name, usage: logs });
});

module.exports = router;
