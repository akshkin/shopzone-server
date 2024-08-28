const Order = require("../models/order.js");
const Orders = require("../models/orders.js");
const Product = require("../models/product.js");

const addOrderItem = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length > 0) {
    const order = new Order({
      ...req.body,
      user: req.user._id,
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item.product._id,
        _id: undefined,
      })),
    });
    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } else {
    res.status(400).json({ message: "No order items." });
  }
};

const addOrderItemUnlogged = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    email,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length > 0) {
    const order = new Order({
      ...req.body,
      guestUser: email,
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item.product._id,
        _id: undefined,
      })),
    });
    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } else {
    res.status(400).json({ message: "No order items." });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "orderItems.product",
        model: Product,
      });
    if (order) {
      return res.json(order);
    } else {
      res.status(404).json({ message: "Order not found." });
    }
  } catch (error) {
    console.log(error);
  }
};

const getOrderUnlogged = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "orderItems.product",
      model: Product,
    });
    if (order) {
      return res.json(order);
    } else {
      res.status(404).json({ message: "Order not found." });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateOrderPayment = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      },
    });
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
};

const getOrders = async (req, res) => {
  const userId = req.user.id;
  const { page = 1 } = req.query;
  const limit = 8;

  const skipAmount = (page - 1) * limit;

  try {
    let orders = await Order.find({ user: userId })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: Product,
        },
      })
      .limit(limit)
      .skip(skipAmount)
      .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments({ user: userId });

    const isNextPage = totalOrders > skipAmount + orders.length;

    if (!orders) {
      return res.json({ message: "No orders found." });
    }

    res.status(200).json({
      orders,
      isNextPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not get orders" });
  }
};

module.exports = {
  addOrderItem,
  addOrderItemUnlogged,
  getOrder,
  getOrderUnlogged,
  updateOrderPayment,
  getOrders,
};
