const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const userRouter = require("../routes/user");
const productRouter = require("../routes/product");
const corsOptions = require("../config/corsOptions");
const app = express();
const port = process.env.PORT || 8000;
dotenv.config();

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(userRouter);
app.use(productRouter);

const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(port, () => {
      console.log(`Server is runnin on port ${port}`);
    })
  )
  .catch((error) => console.log(error));
