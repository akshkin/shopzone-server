const express = require("express");
const { adminAuth, auth } = require("../middleware/auth.js");
const {
  validation,
  signIn,
  signUp,
  signOut,
  updateProfile,
  getProfile,
  deleteProfile,
  getAllUsers,
  saveShippingInfo,
  getShippingInfo,
} = require("../controllers/user");

const router = new express.Router();

router.post("/users/signup", validation, signUp);

router.post("/users/signin", signIn);

router.post("/users/signout", auth, signOut);

router.get("/users/profile", auth, getProfile);

router.patch("/users/profile", auth, updateProfile);

router.delete("/users/profile", auth, deleteProfile);

router.get("/users/admin", auth, getAllUsers);

router.patch("/users/save/address", auth, saveShippingInfo);

router.get("/users/save/address", auth, getShippingInfo);

module.exports = router;
