// usage.js

const express = require("express");
const router = express.Router();
const Site = require("../models/Site");
const Usage = require("../models/Usage");

// GET /sites/:id/usage — fetch usage logs with optional filtering and pagination
// Query params: provider, from, to, page, limit
router.get("/:id/usage", async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Site not found" });
  if (site.apiKey !== apiKey) return res.status(401).json({ error: "Invalid API key" });

  const { provider, from, to, page = 1, limit = 25 } = req.query;

  const filter = { siteId: site._id };
  if (provider) {
    filter.aiProvider = { $in: Array.isArray(provider) ? provider : [provider] };
  }
  if (from || to) {
    filter.timestamp = {};
    if (from) filter.timestamp.$gte = new Date(from);
    if (to) filter.timestamp.$lte = new Date(to);
  }

  const total = await Usage.countDocuments(filter);
  const logs = await Usage.find(filter)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    siteId: site._id,
    name: site.name,
    usage: logs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
});

module.exports = router;
