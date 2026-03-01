// injectMetadata.js

function injectMetadata(res, licenseOption) {
  const originalSend = res.send;

  res.send = function (body) {
    if (typeof body === "string" && body.includes("</head>")) {
      const metaTag = `<meta name="ai-usage" content="${licenseOption.license || "allowed"}">`;
      body = body.replace("</head>", `${metaTag}</head>`);
    }
    return originalSend.call(this, body);
  };
}

module.exports = injectMetadata;
