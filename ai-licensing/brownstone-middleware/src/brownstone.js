// brownstone.js

const detectAI = require("./detectAI");
const injectMetadata = require("./injectMetadata");
const logHit = require("./meterUsage");
const checkLicense = require("./enforce");
const logUnknown = require("./logUnknown");
const serveLlmsTxt = require("./serveLlmsTxt");

function brownstone(options = {}) {
  return async function (req, res, next) {
    if (serveLlmsTxt(req, res, options)) return;

    const userAgent = req.headers["user-agent"] || "";
    const aiSource = detectAI(userAgent);

    // Inject meta tag into HTML responses
    injectMetadata(res, options);

    if (!aiSource) {
      if (options.metering) await logUnknown(req, options);
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
