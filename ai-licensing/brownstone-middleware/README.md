# brownstone-middleware

Express middleware for detecting, logging, and enforcing licensing around AI agent access to your application.

Brownstone identifies AI crawlers and bots by their user-agent, injects licensing metadata into your HTML responses, and optionally logs hits and blocks unauthorized AI access — all in a few lines of code.

## Install

```bash
npm install brownstone-middleware
```

## Usage

```js
const express = require("express");
const brownstone = require("brownstone-middleware");

const app = express();

app.use(
  brownstone({
    apiKey: "your-brownstone-api-key",
    metering: true,
    enforcement: true,
    license: {
      model: "paid",
      rate: "$0.001-per-1000-tokens",
      permission: "allowed",
    },
  })
);

app.get("/", (req, res) => {
  res.send("<html><head></head><body>Hello</body></html>");
});
```

## How it works

1. Each incoming request is checked for a known AI user-agent
2. If an AI is detected and `metering` is enabled, the hit is logged to your Brownstone dashboard
3. If `enforcement` is enabled, the request is checked against your site's license — blocked AIs receive a `403` response
4. A `<meta name="ai-usage">` tag is injected into every HTML response so AI crawlers can read your licensing terms directly from the page

## Options

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | string | Yes (if metering or enforcement enabled) | Your Brownstone site API key |
| `metering` | boolean | No | Log AI hits to the Brownstone API |
| `enforcement` | boolean | No | Block AIs based on your site's configuration |
| `license` | object | No | License info injected into HTML meta tag |
| `license.model` | string | No | `"free"` or `"paid"` |
| `license.rate` | string | No | e.g. `"$0.001-per-1000-tokens"` |
| `license.permission` | string | No | `"allowed"`, `"restricted"`, or `"blocked"` |

## Detected AI agents

Brownstone detects the following bots out of the box:

- ChatGPT (OpenAI)
- Claude (Anthropic)
- BingAI (Microsoft)
- Perplexity
- Gemini (Google)
- Grok (xAI)
- Meta AI
- Common Crawl
- Cohere
- Diffbot
- Bytespider (ByteDance)

## Get an API key

Register your site and get an API key at [brownstone.dev](https://brownstone.dev) (coming soon) or by running the Brownstone API locally.

## License

MIT
