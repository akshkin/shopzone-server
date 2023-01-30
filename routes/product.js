const express = require("express");
const router = new express.Router();
const {
  upload,
  uploadImage,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

router.get("/products", getProducts);
router.post("/products/upload", upload.single("image"), uploadImage);
router.post("/products", createProduct);
router.patch("/products", updateProduct);
router.delete("/product", deleteProduct);

module.exports = router;
