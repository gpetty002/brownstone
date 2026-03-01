// brownstone.js

const detectAI = require("./detectAI");
const injectMetadata = require("./injectMetadata");
// const logHit = require("./meterUsage");
// const checkLicense = require("./enforce");

function brownstone(options = {}) {
  return async function (req, res, next) {
    const userAgent = req.headers["user-agent"] || "";
    const aiSource = detectAI(userAgent);

    // Inject meta tag into HTML responses
    injectMetadata(res, options);

    if (!aiSource) return next();

    // Remove these comments when you are ready to
    // implement metering and enforcement
    // if (options.metering) {
    //   await logHit(aiSource, res, options);
    // }

    // if (options.enforcement) {
    //   const allowed = await checkLicense(aiSource, options);
    //   if (!allowed) {
    //     return res.status(403).send("AI blocked.");
    //   }
    // }

    next();
  };
}

module.exports = brownstone;
