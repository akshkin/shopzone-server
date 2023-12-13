const express = require("express");
const {
  addOrderItem,
  addOrderItemUnlogged,
  getOrder,
  getOrderUnlogged,
  updateOrderPayment,
} = require("../controllers/order");
const { auth } = require("../middleware/auth");
const router = new express.Router();

router.post("/order/create", auth, addOrderItem);
router.post("/order/create-unlogged", addOrderItemUnlogged);
router.get("/order/:id", auth, getOrder);
router.get("/order-unlogged/:id", getOrderUnlogged);
// router.post("/order/checkout", checkout);
router.put("/order/:id/pay", updateOrderPayment);

module.exports = router;
