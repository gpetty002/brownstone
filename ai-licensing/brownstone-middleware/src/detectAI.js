// detectAI.js

const aiAgents = [
  { name: "ChatGPT", ua: ["ChatGPTBot", "OpenAI"] },
  { name: "Claude", ua: ["ClaudeBot", "Anthropic"] },
  { name: "BingAI", ua: ["Bingbot", "EdgeAI"] },
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
