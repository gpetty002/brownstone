// detectAI.js

const aiAgents = [
  { name: "ChatGPT", ua: ["ChatGPTBot", "OAI-SearchBot"] },
  { name: "OpenAI Training Crawler", ua: ["GPTBot"] },
  { name: "Claude", ua: ["ClaudeBot", "Claude-Web", "Anthropic"] },
  { name: "BingAI", ua: ["Bingbot", "EdgeAI"] },
  { name: "Perplexity", ua: ["PerplexityBot"] },
  { name: "Gemini", ua: ["Google-Extended", "Googlebot-Extended"] },
  { name: "Grok", ua: ["xAI"] },
  { name: "Meta", ua: ["meta-externalagent", "FacebookBot"] },
  { name: "CommonCrawl", ua: ["CCBot"] },
  { name: "Cohere", ua: ["cohere-ai"] },
  { name: "Diffbot", ua: ["Diffbot"] },
  { name: "Bytespider", ua: ["Bytespider"] },
  { name: "YouBot", ua: ["YouBot"] },
  { name: "AppleBot", ua: ["Applebot"] },
  { name: "DuckAssist", ua: ["DuckAssistBot"] },
  { name: "Amazonbot", ua: ["Amazonbot"] },
];

function detectAI(userAgent = "") {
  for (const agent of aiAgents) {
    if (agent.ua.some((str) => userAgent.includes(str))) {
      return agent.name;
    }
  }
  return null;
}

module.exports = detectAI;
