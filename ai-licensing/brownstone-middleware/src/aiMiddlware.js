// aiMiddlware.js

const detectAI = require("./detectAI");

function aiMiddlware(options = {}) {
  return function (req, res, next) {
    const userAgent = req.headers["user-agent"] || "";
    const aiSource = detectAI(userAgent);

    if (aiSource) {
      console.log("AI detected:", aiSource);
    }

    // Inject meta tag into HTML responses
    const originalSend = res.send;

    res.send = function (body) {
      if (typeof body === "string" && body.includes("</head>")) {
        const metaTag = `<meta name="ai-usage" content="${options.license || "allowed"}">`;
        body = body.replace("</head>", `${metaTag}</head>`);
      }
      return originalSend.call(this, body);
    };
    next();
  };
}

module.exports = aiMiddlware;
