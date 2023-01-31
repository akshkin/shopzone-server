const User = require("../models/user.js");
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
  const user = new User(req.body);
  const { email, password, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ message: "Email already in use" }] });
    }
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ eroors: [{ message: "Server error" }] });
  }
};

const signIn = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ errors: [{ message: "Invalidemail or password" }] });
  }
};

const signOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.json(req.user);
    console.log(req.user.tokens);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  try {
    res.json(req.user);
    console.log(req.user.tokens);
  } catch (error) {
    res.json(error);
  }
};

const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteProfile = async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).json({ message: "Accpunt deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  try {
    res.json(users);
  } catch (error) {
    res.json(error);
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
};
