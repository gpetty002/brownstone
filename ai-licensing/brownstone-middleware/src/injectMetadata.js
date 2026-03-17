// injectMetadata.js

function injectMetadata(res, licenseOption) {
  const originalSend = res.send;

  res.send = function (body) {
    if (typeof body === "string" && body.includes("</head>")) {
      const license = licenseOption.license || {};
      const content = [
        license.model || "free",
        license.rate || null,
        license.permission || "allowed",
      ]
        .filter(Boolean)
        .join("|");
      const metaTag = `<meta name="ai-usage" content="${content}">`;
      body = body.replace("</head>", `${metaTag}</head>`);
    }
    return originalSend.call(this, body);
  };
}

module.exports = injectMetadata;
