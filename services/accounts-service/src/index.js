const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");

require("dotenv").config();
require("./models/User");
require("./models/Project");
require("./models/apiKey");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));

app.use("/project", require("./routes/project.routes"));

app.get("/health", (req, res) => {
  res.send("OK");
});

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("DB sync error:", err));

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
