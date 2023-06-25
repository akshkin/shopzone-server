const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
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
    },
  ],
});
const Favorite = mongoose.model("Favorites", favoritesSchema);

module.exports = Favorite;
