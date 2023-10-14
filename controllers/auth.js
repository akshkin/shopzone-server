const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
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

    const accessToken = jwt.sign(
      { _id: existingUser._id.toString() },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );

    //create secure cookie with refreshtoken
    const refreshToken = jwt.sign(
      { _id: existingUser._id.toString() },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    existingUser.tokens = existingUser.tokens.concat({ token: accessToken });

    await existingUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      // secure: true, //https
      // sameSite: "None", //cross-site-cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expire set to match
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
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
      if (err?.name === "TokenExpiredError")
        return res.status(403).json({ message: "Forbidden" });

      const existingUser = await User.findOne({ _id: decoded._id });

      if (!existingUser)
        return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        { _id: existingUser._id.toString() },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );

      existingUser.tokens = existingUser.tokens.concat({ token: accessToken });

      await existingUser.save();
      res.json({ accessToken });
    }
  );
};

const logout = async (req, res) => {
  try {
    console.log(req.user);
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //no content
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //,
    res.status(200).json({ message: "Cookie cleared" });
    // res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  refresh,
  logout,
};
