const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      totalPrice: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
