const Order = require("../models/order.js");
const Product = require("../models/product.js");

const addOrderItem = async (req, res) => {
  console.log(req.body);
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

/**
 * 
 * const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Your session has expired.  Please login again', {});
    } catch (err) {
      console.log(err);
    }
  };
 
  if (error && error?.data?.message === 'Not authorized - no token') {
    logoutHandler();
  }
 */

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

module.exports = { addOrderItem, getOrder, updateOrderPayment };
