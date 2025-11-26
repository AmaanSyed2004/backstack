const express = require("express");
const router = express.Router();
const { signup, login, verify } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verify);

module.exports = router;
