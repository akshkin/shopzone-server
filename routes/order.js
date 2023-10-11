const express = require("express");
const {
  addOrderItem,
  getOrder,

  updateOrderPayment,
} = require("../controllers/order");
const { auth } = require("../middleware/auth");
const router = new express.Router();

router.post("/order/create", auth, addOrderItem);
router.get("/order/:id", auth, getOrder);
// router.post("/order/checkout", checkout);
router.put("/order/:id/pay", updateOrderPayment);

module.exports = router;
