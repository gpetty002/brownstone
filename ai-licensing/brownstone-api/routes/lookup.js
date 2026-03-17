// lookup.js

const express = require("express");
const router = express.Router();
const Site = require("../models/Site");

// GET /lookup?domain=example.com — public, no auth required
router.get("/", async (req, res) => {
  const { domain } = req.query;

  if (!domain) return res.status(400).json({ error: "domain query parameter is required" });

  const site = await Site.findOne({ domain });
  if (!site) return res.status(404).json({ error: "No licensing info found for this domain" });

  res.json({
    domain: site.domain,
    name: site.name,
    license: site.license,
    blockedAIs: site.blockedAIs,
    enforcementEnabled: site.enforcementEnabled,
    llmsTxt: `https://${site.domain}/llms.txt`,
  });
});

module.exports = router;
