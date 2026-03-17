const express = require("express");
const brownstone = require("../brownstone-middleware/src/brownstone");

const app = express();

app.use(
  brownstone({
    apiKey: "brownstone-test-key-abc123",
    metering: "true",
    enforcement: "true",
    license: { model: "paid", rate: "$0.001-per-1000-tokens", permission: "allowed" },
  }),
);

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Test Site</title>
      </head>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
