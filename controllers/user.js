const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const validation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid Email address").isEmail(),
  check(
    "password",
    "Please include a password with 7 or more characters"
  ).isLength({ min: 7 }),
];

const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = new User(req.body);
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET
    );
    user.tokens = user.tokens.concat({ token });

    await user.save();

    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email }).exec();

    if (!existingUser) {
      return res.status(401).json({ message: "Unable to login" });
    }

    const match = await bcrypt.compare(password, existingUser.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { _id: existingUser._id.toString() },
      process.env.JWT_SECRET
    );

    existingUser.tokens = existingUser.tokens.concat({ token });
    await existingUser.save();

    res.status(200).json({ existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid email or password" });
  }
};

const signOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json(req.user);
    console.log(req.user);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  try {
    if (!users?.length) {
      return res.status(404).json({ message: "No users found." });
    }
    res.json(users);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getShippingInfo = async (req, res) => {
  try {
    const user = await User.findOne(req.user).select("shippingAddress");
    if (!user) {
      throw new Error("No user found");
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

const saveShippingInfo = async (req, res) => {
  try {
    const user = await User.findOne(req.user);
    if (!user) {
      throw new Error("No user found");
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        shippingAddress: req.body.shippingAddress,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(updatedUser.shippingAddress);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  validation,
  signIn,
  signUp,
  signOut,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  saveShippingInfo,
  getShippingInfo,
};
