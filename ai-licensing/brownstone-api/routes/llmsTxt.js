// llmsTxt.js

const express = require("express");
const router = express.Router();
const Site = require("../models/Site");

function generateLlmsTxt(site) {
  const lines = [];

  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push("> AI licensing terms for this site, powered by Brownstone.");
  lines.push("");

  lines.push("## License");
  lines.push("");
  if (site.license?.model) lines.push(`- Model: ${site.license.model}`);
  if (site.license?.rate) lines.push(`- Rate: ${site.license.rate}`);
  if (site.license?.permission) lines.push(`- Permission: ${site.license.permission}`);
  lines.push("");

  if (site.blockedAIs?.length > 0) {
    lines.push("## Blocked AIs");
    lines.push("");
    site.blockedAIs.forEach((ai) => lines.push(`- ${ai}`));
    lines.push("");
  }

  lines.push("## Enforcement");
  lines.push("");
  lines.push(`- Enabled: ${site.enforcementEnabled ? "yes" : "no"}`);
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  lines.push("- Licensing powered by Brownstone: https://brownstone.dev");

  return lines.join("\n");
}

// GET /sites/:id/llms.txt
router.get("/:id/llms.txt", async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  const site = await Site.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Site not found" });
  if (site.apiKey !== apiKey) return res.status(401).json({ error: "Invalid API key" });

  res.setHeader("Content-Type", "text/plain");
  res.send(generateLlmsTxt(site));
});

module.exports = router;
