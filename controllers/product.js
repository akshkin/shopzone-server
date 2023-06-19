const Product = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

const uploadImage = async (req, res) => {
  res.send();
};

const getProducts = async (req, res) => {
  let page = parseInt(req.query.page) - 1 || 0;
  let limit = parseInt(req.query.limit);
  let sort = req.query.sort || "rating";
  let category = req.query.category || "All";
  let price = parseInt(req.query.price) || 1000000;
  // let ratings = req.query.rating
  //   ? req.query.rating.split(",").map((r) => parseInt(r))
  //   : [0];

  const categories = [
    "men's clothing",
    "women's clothing",
    "electronics",
    "jewelery",
  ];
  category = category === "All" ? [...categories] : category.split(",");

  const sortBy = {};
  if (req.query.sort) {
    const parts = req.query.sort.split("_");
    sortBy[parts[0]] = parts[1] === "desc" ? -1 : 1;
  } else {
    sortBy["rating"] = -1;
  }

  let query = Product.find()
    .where("category")
    .in([...category])
    .where("price")
    .lt(price)
    .sort(sortBy)
    .skip(page * limit)
    .limit(limit);

  // const ratingFilters = ratings.map((rating) => {
  //   const nextRating = rating + 1;
  //   return { "rating.rate": { $gte: rating, $lt: nextRating } };
  // });

  /**return any products that match any of the filters */
  // query = query.or(ratingFilters);

  const products = await query.exec();

  const totalProducts = products.length;

  const prices = products.map((product) => product.price);

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  const response = {
    totalProducts,
    maxPrice,
    minPrice,
    page: page + 1,
    limit,
    category: categories,
    products,
  };
  try {
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  const { category } = req.query;
  let query = {};
  if (category) {
    query.$or = [{ category: { $regex: category, $options: "i" } }];
  }

  try {
    const products = await Product.find(query);
    const totalProducts = products.length;
    res.status(200).json({ products, totalProducts });
  } catch (error) {
    console.log(error);
    res.status(404).json({ messsage: error.message });
  }
};

const createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProductDetail = async (req, res) => {
  const _id = req.params.id;
  if (mongoose.Types.ObjectId.isValid(_id)) {
    try {
      const product = await Product.findById(_id);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

const searchProducts = async (req, res) => {
  let query = {};
  const { searchQuery } = req.query;
  if (searchQuery) {
    query.$or = [{ title: { $regex: req.query.searchQuery, $options: "i" } }];
  }
  try {
    const products = await Product.find(query);
    const totalProducts = await Product.countDocuments();
    console.log(totalProducts);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const _id = req.params.id;
  const product = req.body;
  console.log(_id);
  if (mongoose.Types.ObjectId.isValid(_id)) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        { ...product },
        { new: true }
      );
      if (!product) {
        console.log("No task");
        return res.status(404).json({ message: "No product by that id" });
      }
      await updatedProduct.save();
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "No product by the selected id" });
  }
};

const deleteProduct = async (req, res) => {
  const _id = req.params._id;

  if (mongoose.Types.ObjectId.isValid(_id)) {
    try {
      const product = await Product.findByIdAndDelete({ _id });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  upload,
  uploadImage,
  getProducts,
  createProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
};
