const Order = require("../models/order.js");

const addOrderItem = async (req, res) => {
  const {
    orderItems,
    shiipingAddress,
    paymentMethod,
    itemsPrice,
    axPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length) {
    const order = new Order({ ...req.body, user: req.user._id });
    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } else {
    res.status(400).json({ message: "No order items." });
  }
};

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name",
    "email"
  );
  if (order) {
    return res.json(order);
  } else {
    res.status(404).json({ message: "Order not found." });
  }
};

module.exports = { addOrderItem, getOrder };
