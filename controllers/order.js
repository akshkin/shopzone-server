const Order = require("../models/order.js");

const addOrderItem = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body.data;
  console.log(req.body.data);

  if (orderItems && orderItems.length > 0) {
    const order = new Order({
      ...req.body,
      user: req.user._id,
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id,
      })),
    });
    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } else {
    res.status(400).json({ message: "No order items." });
  }
};

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    return res.json(order);
  } else {
    res.status(404).json({ message: "Order not found." });
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

const checkout = (req, res) => {};

module.exports = { addOrderItem, getOrder, checkout };
