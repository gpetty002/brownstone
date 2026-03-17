// server,js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const logRoute = require("./routes/log");
const checkRoute = require("./routes/check");
const sitesRoute = require("./routes/sites");
const usageRoute = require("./routes/usage");
const analyticsRoute = require("./routes/analytics");
const unknownHitsRoute = require("./routes/unknownHits");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/log", logRoute);
app.use("/check", checkRoute);
app.use("/sites", sitesRoute);
app.use("/sites", usageRoute);
app.use("/sites", analyticsRoute);
app.use("/unknown-hit", unknownHitsRoute);
app.use("/sites", unknownHitsRoute);

app.listen(4000, () => {
  console.log("Brownstone API running on port 4000");
});
