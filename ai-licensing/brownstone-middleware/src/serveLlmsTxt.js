// serveLlmsTxt.js

function generateLlmsTxt(options) {
  const license = options.license || {};
  const lines = [];

  lines.push(`# ${options.name || "This site"}`);
  lines.push("");
  lines.push("> AI licensing terms for this site, powered by Brownstone.");
  lines.push("");

  lines.push("## License");
  lines.push("");
  if (license.model) lines.push(`- Model: ${license.model}`);
  if (license.rate) lines.push(`- Rate: ${license.rate}`);
  if (license.permission) lines.push(`- Permission: ${license.permission}`);
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  lines.push("- Licensing powered by Brownstone: https://brownstone.dev");

  return lines.join("\n");
}

function serveLlmsTxt(req, res, options) {
  if (req.method === "GET" && req.path === "/llms.txt") {
    res.setHeader("Content-Type", "text/plain");
    res.send(generateLlmsTxt(options));
    return true;
  }
  return false;
}

module.exports = serveLlmsTxt;
