// fireWebhook.js

async function fireWebhook(url, payload) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error(`Webhook delivery failed for ${url}:`, err.message);
  }
}

module.exports = fireWebhook;
