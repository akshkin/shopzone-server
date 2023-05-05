const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

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

  const accessToken = jwt.sign(
    { _id: existingUser._id.toString() },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );

  //create secure cookie with refreshtoken
  const refreshToken = jwt.sign(
    { _id: existingUser._id.toString() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site-cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expire set to match
  });

  res.json({ accessToken });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      console.log(err);
      if (err) return res.status(403).json({ message: "Forbidden" });

      const existingUser = await User.findOne({ _id: decoded._id });

      if (!existingUser)
        return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        { _id: existingUser._id.toString() },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ accessToken });
    }
  );
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //no content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //,
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
