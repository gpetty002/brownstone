// sites.js

const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Site = require("../models/Site");

// POST /sites — register a new site and receive an API key
router.post("/", async (req, res) => {
  const { name, domain, license, enforcementEnabled, blockedAIs, webhookUrl } = req.body;

  if (!name) return res.status(400).json({ error: "name is required" });

  const apiKey = crypto.randomBytes(24).toString("hex");

  let site;
  try {
    site = await Site.create({
      name,
      apiKey,
      license: license || { model: "free", rate: null },
      enforcementEnabled: enforcementEnabled ?? false,
      blockedAIs: blockedAIs || [],
      webhookUrl: webhookUrl || null,
      domain: domain || null,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ error: `A site with that ${field} already exists` });
    }
    throw err;
  }

  res.status(201).json({
    id: site._id,
    name: site.name,
    apiKey: site.apiKey,
    license: site.license,
    enforcementEnabled: site.enforcementEnabled,
    blockedAIs: site.blockedAIs,
    webhookUrl: site.webhookUrl,
    domain: site.domain,
  });
});

module.exports = router;
