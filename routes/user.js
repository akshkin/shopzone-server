const express = require("express");
const { adminAuth } = require("../middleware/auth.js");
const {
  validation,
  signIn,
  signUp,
  signOut,
  updateProfile,
  getProfile,
  deleteProfile,
  getAllUsers,
} = require("../controllers/user");
const verifyJWT = require("../middleware/verifyJwt");

const router = new express.Router();

router.post("/users/signup", validation, signUp);

router.post("/users/signin", signIn);

router.post("/users/signout", verifyJWT, signOut);

router.get("/users/profile", verifyJWT, getProfile);

router.patch("/users/profile", verifyJWT, updateProfile);

router.delete("/users/profile", verifyJWT, deleteProfile);

router.get("/users/admin", verifyJWT, getAllUsers);

module.exports = router;
