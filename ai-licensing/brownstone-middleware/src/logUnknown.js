// logUnknown.js

async function logUnknown(req, options) {
  const userAgent = req.headers["user-agent"] || "";
  if (!userAgent) return;

  try {
    await fetch(`${options.apiUrl}/unknown-hit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": options.apiKey,
      },
      body: JSON.stringify({
        userAgent,
        path: req.originalUrl,
        ip: req.ip,
      }),
    });
  } catch (err) {
    console.error("Unknown bot log failed:", err.message);
  }
}

module.exports = logUnknown;
