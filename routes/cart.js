const express = require("express");
const {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  clearItemFromCart,
} = require("../controllers/cart");
const { auth } = require("../middleware/auth");

const router = new express.Router();

router.post("/cart/add", auth, addToCart);
router.post("/cart/remove", auth, removeFromCart);
router.post("/cart/clearItem", auth, clearItemFromCart);
router.post("/cart/clear", auth, clearCart);
router.get("/cart/get", auth, getCart);

module.exports = router;
