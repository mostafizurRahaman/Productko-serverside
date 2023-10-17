const express = require("express");
const cors = require("cors");

//  require : routes:
const categoryRouter = require("./routes/category.route");

//  create an app:
const app = express();

//  middlewares:
app.use(cors());
app.use(express.json());

//  routes:

app.use("/api/v1/category", categoryRouter);

//  export app:
module.exports = app;
