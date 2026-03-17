// log.js

const express = require("express");
const router = express.Router();
const Site = require("../models/Site");
const Usage = require("../models/Usage");

router.post("/", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const { ai, path, ip } = req.body;

  const site = await Site.findOne({ apiKey });
  if (!site) return res.status(401).json({ error: "Invalid API key" });

  await Usage.create({
    siteId: site._id,
    aiProvider: ai,
    path,
    ip,
  });

  res.json({ success: true });
});

module.exports = router;
