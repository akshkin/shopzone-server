const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      return res
        .status(401)
        .json({ errors: [{ message: "Please log in to continue" }] });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ errors: [{ message: "Please log in to continue" }] });
  }
};

const adminAuth = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};

module.exports = { auth, adminAuth };
