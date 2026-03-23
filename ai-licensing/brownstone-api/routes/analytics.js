// analytics.js

const express = require("express");
const router = express.Router();
const Site = require("../models/Site");
const Usage = require("../models/Usage");

// GET /sites/:id/analytics
router.get("/:id/analytics", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const tz = req.query.tz || "UTC";

  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Site not found" });
  if (site.apiKey !== apiKey) return res.status(401).json({ error: "Invalid API key" });

  const now = new Date();
  const last7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const last30 = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [total, last7Count, last30Count, byProvider, daily] = await Promise.all([
    Usage.countDocuments({ siteId: site._id }),

    Usage.countDocuments({ siteId: site._id, timestamp: { $gte: last7 } }),

    Usage.countDocuments({ siteId: site._id, timestamp: { $gte: last30 } }),

    Usage.aggregate([
      { $match: { siteId: site._id } },
      { $group: { _id: "$aiProvider", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Usage.aggregate([
      { $match: { siteId: site._id, timestamp: { $gte: last30 } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp", timezone: tz } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({
    siteId: site._id,
    name: site.name,
    summary: { total, last7Days: last7Count, last30Days: last30Count },
    byProvider: byProvider.map((p) => ({ provider: p._id, count: p.count })),
    daily: daily.map((d) => ({ date: d._id, count: d.count })),
  });
});

module.exports = router;
