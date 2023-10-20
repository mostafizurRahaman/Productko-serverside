const express = require("express");
const cors = require("cors");

//  require : routes:
const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const productRouter = require("./routes/product.route");

//  create an app:
const app = express();

//  middlewares:
app.use(cors());
app.use(express.json());

//  routes:
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

//  export app:
module.exports = app;
