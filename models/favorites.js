const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
    },
  ],
});
const Favorite = mongoose.model("Favorites", favoritesSchema);

module.exports = Favorite;
