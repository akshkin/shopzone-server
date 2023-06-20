const express = require("express");
const { auth } = require("../middleware/auth");
const { toggleFavorites, getFavorites } = require("../controllers/favorites");

const router = new express.Router();

router.post("/favorites/add", auth, toggleFavorites);
router.get("/favorites/get", auth, getFavorites);

module.exports = router;
