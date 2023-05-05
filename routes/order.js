const express = require("express");
const router = new express.Router();
const verifyJWT = require("../middleware/verifyJwt");
const { addOrderItem, getOrder } = require("../controllers/order");

router.post("/order/create", verifyJWT, addOrderItem);
router.get("/order/:id", verifyJWT, getOrder);

module.exports = router;
