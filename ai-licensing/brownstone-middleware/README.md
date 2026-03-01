### 🧪 How A Developer Would Use It

In their Express app:

```javascript
const express = require("express");
const brownstone = require("brownstone-middleware");

const app = express();

app.use(
  brownstone({
    apiKey: "their-key",
    endpoint: "https://api.brownstone.ai/log",
  }),
);

app.listen(3000);
```
