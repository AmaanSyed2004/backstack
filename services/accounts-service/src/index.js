const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors"); // Make sure this is installed: npm install cors

require("dotenv").config();
require("./models/User");
require("./models/Project");
require("./models/apiKey");

const app = express();

// UPDATED CORS CONFIGURATION
// app.use(cors({
//   origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

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