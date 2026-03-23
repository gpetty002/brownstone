// migrate.js — reclassify unknown hits that are now recognized by detectAI

const express = require("express");
const router = express.Router();
const UnknownHit = require("../models/UnknownHit");
const Usage = require("../models/Usage");

const aiAgents = [
  { name: "ChatGPT", ua: ["ChatGPTBot", "OAI-SearchBot"] },
  { name: "OpenAI Training Crawler", ua: ["GPTBot"] },
  { name: "Claude", ua: ["ClaudeBot", "Claude-Web", "Anthropic"] },
  { name: "BingAI", ua: ["Bingbot", "EdgeAI"] },
  { name: "Perplexity", ua: ["PerplexityBot"] },
  { name: "Gemini", ua: ["Google-Extended", "Googlebot-Extended"] },
  { name: "Grok", ua: ["xAI"] },
  { name: "Meta", ua: ["meta-externalagent", "FacebookBot"] },
  { name: "CommonCrawl", ua: ["CCBot"] },
  { name: "Cohere", ua: ["cohere-ai"] },
  { name: "Diffbot", ua: ["Diffbot"] },
  { name: "Bytespider", ua: ["Bytespider"] },
  { name: "YouBot", ua: ["YouBot"] },
  { name: "AppleBot", ua: ["Applebot"] },
  { name: "DuckAssist", ua: ["DuckAssistBot"] },
  { name: "Amazonbot", ua: ["Amazonbot"] },
];

function detectAI(userAgent = "") {
  for (const agent of aiAgents) {
    if (agent.ua.some((str) => userAgent.includes(str))) return agent.name;
  }
  return null;
}

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
