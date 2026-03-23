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

// GET /sites/:id — fetch site settings
router.get("/:id", async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Site not found" });
  if (site.apiKey !== apiKey) return res.status(401).json({ error: "Invalid API key" });

  res.json({
    id: site._id,
    name: site.name,
    license: site.license,
    enforcementEnabled: site.enforcementEnabled,
    blockedAIs: site.blockedAIs,
    domain: site.domain,
  });
});

// PATCH /sites/:id — update site settings
router.patch("/:id", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const { blockedAIs, license, enforcementEnabled } = req.body;

  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Site not found" });
  if (site.apiKey !== apiKey) return res.status(401).json({ error: "Invalid API key" });

  if (blockedAIs !== undefined) site.blockedAIs = blockedAIs;
  if (license !== undefined) site.license = { ...site.license, ...license };
  if (enforcementEnabled !== undefined) site.enforcementEnabled = enforcementEnabled;

  await site.save();

  res.json({
    id: site._id,
    name: site.name,
    license: site.license,
    enforcementEnabled: site.enforcementEnabled,
    blockedAIs: site.blockedAIs,
  });
});

module.exports = router;
