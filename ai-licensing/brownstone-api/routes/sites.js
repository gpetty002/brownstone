// sites.js

const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Site = require("../models/Site");

// POST /sites — register a new site and receive an API key
router.post("/", async (req, res) => {
  const { name, license, enforcementEnabled, blockedAIs } = req.body;

  if (!name) return res.status(400).json({ error: "name is required" });

  const apiKey = crypto.randomBytes(24).toString("hex");

  const site = await Site.create({
    name,
    apiKey,
    license: license || { model: "free", rate: null },
    enforcementEnabled: enforcementEnabled ?? false,
    blockedAIs: blockedAIs || [],
  });

  res.status(201).json({
    id: site._id,
    name: site.name,
    apiKey: site.apiKey,
    license: site.license,
    enforcementEnabled: site.enforcementEnabled,
    blockedAIs: site.blockedAIs,
  });
});

module.exports = router;
