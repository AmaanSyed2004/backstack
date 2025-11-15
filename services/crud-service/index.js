const express = require("express");
const dynamicRoutes = require("./src/routes/crud.router");

const app = express();
app.use(express.json());
app.get("/health", (req, res) => res.send("OK"));

app.use("/", dynamicRoutes);

app.listen(4002, () => console.log(`Dynamic CRUD Engine running on port 4002`));
