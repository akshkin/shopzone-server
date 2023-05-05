const express = require("express");
const router = new express.Router();
const { adminAuth } = require("../middleware/auth");
const {
  upload,
  uploadImage,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  searchProducts,
  getProductsByCategory,
} = require("../controllers/product");
const verifyJWT = require("../middleware/verifyJwt");

router.get("/products", verifyJWT, getProducts);
router.post("/products/upload", upload.single("image"), uploadImage);
router.post("/products", verifyJWT, adminAuth, createProduct);
router.get("/products/search", searchProducts);
router.get("/products/category", getProductsByCategory);
router.get("/products/:id", getProductDetail);
router.patch("/products/:productId", verifyJWT, adminAuth, updateProduct);
router.delete("/products/:productId", verifyJWT, adminAuth, deleteProduct);

module.exports = router;
