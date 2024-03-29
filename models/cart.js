const mongoose = require("mongoose");
const itemSchema = require("./item.schema");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    // {
    //   product: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: "Product",
    //   },
    //   quantity: {
    //     type: Number,
    //     required: true,
    //     default: 1,
    //   },
    //   totalPrice: {
    //     type: Number,
    //     required: true,
    //     default: 0,
    //   },
    // },
    itemSchema,
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
