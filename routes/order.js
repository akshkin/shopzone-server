const express = require("express");
const router = new express.Router();
const { addOrderItem, getOrder } = require("../controllers/order");
const { auth } = require("../middleware/auth");

router.post("/order/create", auth, addOrderItem);
router.get("/order/:id", auth, getOrder);

module.exports = router;
