// migrate.js — reclassify unknown hits that are now recognized by detectAI

const express = require("express");
const router = express.Router();
const UnknownHit = require("../models/UnknownHit");
const Usage = require("../models/Usage");
const detectAI = require("../../brownstone-middleware/src/detectAI");

// POST /migrate/unknown-hits
// Protected by ADMIN_KEY env var — run this after adding new bots to detectAI.js
router.post("/unknown-hits", async (req, res) => {
  if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const unknownHits = await UnknownHit.find();
  let moved = 0;

  for (const hit of unknownHits) {
    const aiSource = detectAI(hit.userAgent);
    if (aiSource) {
      await Usage.create({
        siteId: hit.siteId,
        aiProvider: aiSource,
        path: hit.path,
        ip: hit.ip,
        timestamp: hit.timestamp,
      });
      await hit.deleteOne();
      moved++;
    }
  }

  res.json({ moved, message: `${moved} unknown hit(s) reclassified` });
});

module.exports = router;
