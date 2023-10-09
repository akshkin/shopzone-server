const express = require("express");
const { addOrderItem, getOrder, checkout } = require("../controllers/order");
const { auth } = require("../middleware/auth");
const router = new express.Router();

router.post("/order/create", auth, addOrderItem);
router.get("/order/:id", auth, getOrder);
router.post("/order/checkout", checkout);

module.exports = router;
