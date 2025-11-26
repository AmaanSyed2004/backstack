const express = require("express");
const sequelize = require("./config/db");

require("dotenv").config();
require("./models/EndUser.js");

const app = express();

app.use(express.json());

app.use("/", require("./routes/auth.routes"));

app.get("/health", (req, res) => {
  res.send("OK");
});

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("DB sync error:", err));

app.listen(4003, () => {
  console.log("Server is running on port 4003");
});
