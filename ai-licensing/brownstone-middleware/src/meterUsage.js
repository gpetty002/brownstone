// meterUsage.js

async function logHit(aiSource, req, options) {
  await fetch("http://localhost:4000/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": options.apiKey,
    },
    body: JSON.stringify({
      ai: aiSource,
      path: req.originalUrl,
      ip: req.ip,
    }),
  });
}

module.exports = logHit;
