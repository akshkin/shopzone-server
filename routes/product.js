const express = require("express");
const router = new express.Router();
const { auth, adminAuth } = require("../middleware/auth");
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
router.post("/products", auth, adminAuth, createProduct);
router.patch("/products/:productId", auth, adminAuth, updateProduct);
router.delete("/products/:productId", auth, adminAuth, deleteProduct);

module.exports = router;
