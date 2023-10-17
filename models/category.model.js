const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const categorySchema = mongoose.Schema({
   name: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      minLength: [2, "Category Name Minimum 2 char"],
      maxLength: [100, "Name should be max 100 char"],
      required: [true, "please provide a name"],
   },
   image: {
      type: String,
      validate: [validator.isURL, "please provide a valid url"],
      required: [true, "please provide an URL"],
   },
   // products: [
   //    {
   //       type: ObjectId,
   //       required: [true, "please provide an product id"],
   //       ref: "Products",
   //    },
   // ],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
