const Cart = require("../models/cart");
const Product = require("../models/product");

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItem } = req.body;

  try {
    const product = await Product.findById(cartItem._id);

    if (!product) {
      return res.status(404).json({ message: "Product nor found" });
    }
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [
          {
            //productId: product._id,
            product: product._id,
            quantity: 1,
            totalPrice: product.price,
          },
        ],
      });
    }

    await cart.save();

    const cartProductIndex = cart.products?.findIndex((item) =>
      item.product._id.equals(product._id)
    );

    if (cartProductIndex !== -1) {
      const cartProduct = cart.products[cartProductIndex];
      cartProduct.quantity += 1;
      cartProduct.totalPrice = product.price * cartProduct.quantity;
    } else {
      const newCartItem = {
        // productId: product._id,
        product: product._id,
        quantity: 1,
        totalPrice: product.price,
      };
      cart.products.push(newCartItem);
    }
    const totalPrice = cart.products.reduce(
      (acc, current) => acc + current.totalPrice,
      0
    );
    await cart.save();
    cart = await Cart.findOne({ user: userId }).populate({
      path: "products",
      populate: {
        path: "product",
        model: Product,
      },
    });
    console.log(cart);
    await cart.save();
    res.status(200).json({ cart, totalPrice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not add product to cart." });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const _id = req.body.id;

  try {
    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartProductIndex = cart.products.findIndex((item) =>
      item.product._id.equals(product._id)
    );

    let cartProduct;

    if (cartProductIndex !== -1) {
      cartProduct = cart.products[cartProductIndex];
      if (cartProduct.quantity > 1) {
        cartProduct.quantity -= 1;
        cartProduct.totalPrice = product.price * cartProduct.quantity;
      } else if (cartProduct.quantity === 1) {
        cart.products.splice(cartProductIndex, 1);
      }
    }

    const totalPrice = cart.products.reduce(
      (acc, current) => acc + current.totalPrice,
      0
    );
    await cart.save();
    cart = await Cart.findOne({ user: userId }).populate({
      path: "products",
      populate: {
        path: "product",
        model: Product,
      },
    });
    await cart.save();
    res.status(200).json({ cart, totalPrice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not remove product from cart." });
  }
};

const clearItemFromCart = async (req, res) => {
  const userId = req.user.id;
  const _id = req.body.id;

  try {
    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartProductIndex = cart.products.findIndex((item) =>
      item.product._id.equals(product._id)
    );
    if (cartProductIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      cart.products.splice(cartProductIndex, 1);
    }

    const totalPrice = cart.products.reduce(
      (acc, current) => acc + current.totalPrice,
      0
    );

    await cart.save();

    cart = await Cart.findOne({ user: userId })
      .populate({
        path: "products.product",
        model: Product,
      })
      .exec();
    await cart.save();
    res.status(200).json({ cart, totalPrice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not remove product from cart." });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.products = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not clear cart" });
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "products",
      populate: {
        path: "product",
        model: Product,
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const totalPrice = cart.products.reduce(
      (acc, current) => acc + current.totalPrice,
      0
    );
    console.log(cart);

    res.status(200).json({ cart, totalPrice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not get cart" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  clearItemFromCart,
};
