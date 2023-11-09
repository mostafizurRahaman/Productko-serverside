const express = require("express");
const cors = require("cors");

//  require : routes:
const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const productRouter = require("./routes/product.route");
const bookingRoute = require("./routes/booking.route");
const paymentRouter = require("./routes/payment.route");

//  create an app:
const app = express();

//  middlewares:
app.use(cors());
app.use(express.json());

//  routes:
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/payment", paymentRouter);

//  export app:
module.exports = app;
