const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, //limit  each IP tp 5 login requests per window per minute
  message: {
    message:
      "Too many login attempts from this IP, please try again after 60 seconds pause",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, //Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, //Disable the X-RateLimit-* headers
});

module.exports = loginLimiter;
