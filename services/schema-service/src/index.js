const express = require("express");
const sequelize = require("./config/db");
require("dotenv").config();
require("./models/Collections");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.send("OK"));

app.use("/", require("./routes/schema.routes"));


sequelize
  .sync({ alter: true })
  .then(() => console.log("Schema DB synced"))
  .catch((err) => console.error("DB sync error:", err));

app.listen(4001, () => {
  console.log("Schema service listening on port 4001");
});
