// brownstone.js

const detectAI = require("./detectAI");
const injectMetadata = require("./injectMetadata");
const logHit = require("./meterUsage");
const checkLicense = require("./enforce");
const logUnknown = require("./logUnknown");
const serveLlmsTxt = require("./serveLlmsTxt");

/**
 * @typedef {Object} BrownstonOptions
 * @property {string} apiKey - Your Brownstone API key
 * @property {string} apiUrl - Base URL of the Brownstone API (e.g. "https://api.usebrownstone.com")
 * @property {boolean} [metering] - Log AI and unknown bot hits
 * @property {boolean} [enforcement] - Block AI crawlers without a valid license
 * @property {string} [llmsTxt] - Custom llms.txt content to serve
 */

/**
 * @param {BrownstonOptions} options
 */
function brownstone(options = {}) {
  options = { apiUrl: "https://api.brownstoneai.dev", ...options };

  return async function (req, res, next) {
    if (serveLlmsTxt(req, res, options)) return;

    const userAgent = req.headers["user-agent"] || "";
    const aiSource = detectAI(userAgent);

    // Inject meta tag into HTML responses
    injectMetadata(res, options);

    if (!aiSource) {
      const looksLikeBot = /bot|crawler|spider|scraper/i.test(userAgent);
      if (options.metering && looksLikeBot) await logUnknown(req, options);
      return next();
    }

    if (options.metering) {
      await logHit(aiSource, req, options);
    }

    if (options.enforcement) {
      const allowed = await checkLicense(aiSource, options);
      if (!allowed) {
        return res.status(403).send("AI blocked.");
      }
    }

    next();
  };
}

module.exports = brownstone;
