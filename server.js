const mongoose = require("mongoose");
const colors = require("colors");
const app = require("./app");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
require("dotenv").config();

//  port
const port = process.env.PORT || 8080;

//  database connect:
mongoose
   .connect(process.env.DATABASE_ATLAS)
   .then(() => {
      console.log(`Database Connected Successfully`.blue.bold);
   })
   .catch((err) => {
      console.log(`Errors in database connection`.red.bold);
   });

//  main route of app:
app.get("/", (req, res, next) => {
   res.status(200).send("YAH!!! Server is running now !!");
});

//  listen the app on port:
app.listen(port, () => {
   console.log(`YAH!! Server is running now!!`);
});

//  global error handler:
app.use(errorHandler);

//  process exit:
process.on("unhandledRejection", (err) => {
   console.log(err.name, err.message);
   mongoose.connection
      .close()
      .then(() => {
         process.exit(1);
      })
      .catch((error) => {
         console.log("mongoose error");
         console.log(error);
      });
});
