const express = require("express");
const getUsers = require("../controllers/data.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/users/:projectId", auth, getUsers);
module.exports = router;