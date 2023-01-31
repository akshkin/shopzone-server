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
  const products = await Product.find();
  try {
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json(error);
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
        return res
          .status(404)
          .json({ error: { message: "No product by that id" } });
      }
      await updatedProduct.save();
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    console.log("here");
    res.status(404).json({ error: { message: "No task by the selected id" } });
  }
};

const deleteProduct = async (req, res) => {
  const _id = req.params._id;

  if (mongoose.Types.ObjectId.isValid(_id)) {
    try {
      const product = await Product.findByIdAndDelete({ _id });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

module.exports = {
  upload,
  uploadImage,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
