const Favorite = require("../models/favorites");
const Product = require("../models/product");

const toggleFavorites = async (req, res) => {
  const userId = req.user.id;
  const { item } = req.body;

  try {
    const product = await Product.findById(item._id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let favorites = await Favorite.findOne({ user: userId });

    if (!favorites) {
      favorites = new Favorite({
        user: userId,
        products: [product._id],
      });
    }

    await favorites.save();

    const favoriteItemIndex = favorites.products.findIndex((item) =>
      item.product._id.equals(product._id)
    );

    if (favoriteItemIndex === -1) {
      favorites.products.push({ product: product._id });
    } else {
      favorites.products.splice(favoriteItemIndex, 1);
    }

    await favorites.save();

    favorites = await Favorite.findOne({ user: userId })
      .populate({
        path: "products",
        populate: { path: "product", ref: "Product" },
      })
      .exec();

    await favorites.save();
    return res.status(200).json(favorites);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not process request." });
  }
};

const getFavorites = async (req, res) => {
  const userId = req.user.id;
  try {
    const favorites = await Favorite.findOne({ user: userId }).populate({
      path: "products",
      populate: {
        path: "product",
        model: Product,
      },
    });
    if (!favorites) {
      return res.json({ message: "No Favorites added" });
    }
    res.status(200).json(favorites);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not fetch favorites" });
  }
};

module.exports = { toggleFavorites, getFavorites };
