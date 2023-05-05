const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // console.log(authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // console.log(authHeader.split(" ")[1]);
    const token = authHeader.split(" ")[1];
    // console.log(token);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      // console.log(err);
      // console.log(decoded);
      if (err) return res.status(403).json({ message: "Forbidden" });
      req.user = decoded._id;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyJWT;
