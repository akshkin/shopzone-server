import Cart from "../models/cart";
import Product from "../models/product";

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItem, quantity } = req.body;

  try {
    const product = await Product.findById({ _id: cartItem._id });
    if (!product) {
      return res.status(404).json({ message: "Product nor found" });
    }
    let cart = await Cart.find({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, product, quantity });
    }
    const cartProduct = cart.products.find((p) => p._id === product._id);
    if (!cartProduct) {
      cartProduct.quantity += 1;
      cartProduct.totalPrice = cartProduct.price * quantity;
    } else {
      // If product doesn't exist, add it to the cart
      const newCartItem = {
        product,
        quantity,
        totalPrice: quantity * product.price,
      };
      cart.products.push(newCartItem);
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not add product to cart." });
  }
};
