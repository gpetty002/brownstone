// enforce.js

async function checkLicense(aiSource, options) {
  const response = await fetch(`${options.apiUrl}/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": options.apiKey,
    },
    body: JSON.stringify({ ai: aiSource }),
  });

  const data = await response.json();
  return data.allowed;
}

module.exports = checkLicense;
