const express = require("express");
const router = new express.Router();
const loginLimiter = require("../middleware/loginLimit");
const { login, refresh, logout } = require("../controllers/auth");

router.post("/auth", loginLimiter, login);
router.get("/auth/refresh", refresh);
router.post("/auth/logout", logout);

module.exports = router;
