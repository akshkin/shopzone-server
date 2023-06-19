const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");
const userRouter = require("../routes/user");
const productRouter = require("../routes/product");
const orderRouter = require("../routes/order");
const corsOptions = require("../config/corsOptions");
const cookieParser = require("cookie-parser");
const cartRouter = require("../routes/cart");
const app = express();
const port = process.env.PORT || 8000;
// dotenv.config();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);

const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(port, () => {
      console.log(`Server is runnin on port ${port}`);
    })
  )
  .catch((error) => console.log(error));
