const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = mongoose.Schema({
   name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "please provide a product name"],
   },
   description: {
      type: String,
      minLength: [50, "description min length 50"],
      maxLength: [100, "description max length 100"],
      required: true,
   },
   category: {
      type: ObjectId,
      ref: "Category",
      required: [true, "please provide a category id"],
   },
   originalPrice: {
      type: Number,
      min: [0, "price shouldn't be negative "],
      required: [true, "please provide a product price"],
   },
   resellPrice: {
      type: Number,
      min: [0, "price shouldn't be negative "],
      required: [true, "please provide a product price"],
   },
   image: {
      type: String,
      validate: [validator.isURL, "Please provide a valid URL"],
      required: [true, "please provide an URL"],
   },

   yearsOfUse: {
      type: String,
      required: true,
   },
   condition: {
      type: String,
      enum: {
         values: ["excellent", "good", "fair"],
         message: `{VALUE} shouldn't be condition`,
      },
      required: true,
   },
   sellerInfo: {
      id: {
         type: ObjectId,
         ref: "User",
         required: true,
      },
      phone: {
         type: String,
         trim: true,
         validate: [
            validator.isMobilePhone,
            "Please provide a valid phone number",
         ],
         required: [true, "please provide your phone number"],
      },
      location: {
         type: String,
         required: [true, "please provide your location"],
      },
   },

   isAdvertised: {
      type: Boolean,
      required: [true, "please provide booking status"],
      default: false,
   },
   status: {
      type: String,
      enum: {
         values: ["available", "booked", "reported"],
         message: `{VALUE} shouldn't be status`,
      },
   },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
