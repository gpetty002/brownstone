const { test } = require("node:test");
const assert = require("node:assert");
const detectAI = require("../src/detectAI");

test("detects ChatGPT", () => {
  assert.strictEqual(detectAI("Mozilla/5.0 ChatGPTBot/1.0"), "ChatGPT");
});

test("detects Claude", () => {
  assert.strictEqual(detectAI("ClaudeBot/1.0"), "Claude");
});

test("detects Perplexity", () => {
  assert.strictEqual(detectAI("PerplexityBot/1.0"), "Perplexity");
});

test("detects Gemini", () => {
  assert.strictEqual(detectAI("Google-Extended"), "Gemini");
});

test("detects Bytespider", () => {
  assert.strictEqual(detectAI("Bytespider/1.0"), "Bytespider");
});

test("returns null for regular browser", () => {
  assert.strictEqual(detectAI("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"), null);
});

test("returns null for empty user agent", () => {
  assert.strictEqual(detectAI(""), null);
});
