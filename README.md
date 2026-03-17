# Brownstone

AI access tracking and licensing for your web application.

Brownstone gives developers visibility into which AI crawlers and bots are accessing their sites, with tools to log usage, enforce licensing terms, and serve standardized licensing metadata — all from a simple Express middleware.

Live at [brownstoneai.dev](https://brownstoneai.dev)

---

## What it does

- Detects AI crawlers by user-agent (ChatGPT, Claude, Perplexity, Gemini, and more)
- Logs AI access to a central database per registered site
- Enforces licensing — block specific AI providers with a 403 response
- Injects `<meta name="ai-usage">` tags into HTML responses
- Auto-generates an `llms.txt` file at `/llms.txt` for standardized AI licensing declarations
- Flags unknown bots that don't match known AI agents
- Provides a public lookup API so AI companies can check a domain's licensing terms

---

## Architecture

```
brownstoneai.dev          → Dashboard (React + Vite, hosted on S3 + CloudFront)
api.brownstoneai.dev      → REST API (Express + MongoDB, hosted on EC2)
npm: brownstone-middleware → Express middleware installed in developer apps
```

---

## Monorepo structure

```
ai-licensing/
├── brownstone-api/        # Express REST API
├── brownstone-middleware/ # npm middleware package
├── brownstone-test-site/  # Local test app
└── dashboard/             # React dashboard (Vite)
```

---

## Getting started locally

**1. Start the API**
```bash
cd brownstone-api
cp .env.example .env      # add your MONGO_URI and ALLOWED_ORIGINS
npm install
node server.js
```

**2. Start the dashboard**
```bash
cd dashboard
npm install
npm run dev
```

**3. Start the test site**
```bash
cd brownstone-test-site
npm install
node server.js
```

---

## Using the middleware

```bash
npm install brownstone-middleware
```

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
```

Get an API key by registering your site at [brownstoneai.dev](https://brownstoneai.dev).

---

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/sites` | None | Register a site, receive an API key |
| `POST` | `/log` | API key | Log an AI access event |
| `POST` | `/check` | API key | Check if an AI is allowed |
| `GET` | `/sites/:id/usage` | API key | Fetch raw access logs |
| `GET` | `/sites/:id/analytics` | API key | Fetch analytics summary and charts |
| `GET` | `/sites/:id/unknown-hits` | API key | Fetch unknown bot logs |
| `GET` | `/sites/:id/llms.txt` | API key | Generate llms.txt from site config |
| `GET` | `/lookup?domain=` | None | Public domain licensing lookup |

---

## Detected AI agents

ChatGPT, Claude, BingAI, Perplexity, Gemini, Grok, Meta, Common Crawl, Cohere, Diffbot, Bytespider

---

## Environment variables

**brownstone-api `.env`**
```
MONGO_URI=your-mongodb-connection-string
ALLOWED_ORIGINS=https://brownstoneai.dev
```

**dashboard `.env.development`**
```
VITE_API_URL=http://localhost:4000
```

**dashboard `.env.production`**
```
VITE_API_URL=https://api.brownstoneai.dev
```

---

## Deployment

| Component | Platform |
|---|---|
| Dashboard | AWS S3 + CloudFront |
| API | AWS EC2 + Nginx + PM2 |
| Database | MongoDB Atlas |
| Domain | Route 53 + brownstoneai.dev |

---

Built by [Gisselle Petty](https://github.com/gpetty002)
