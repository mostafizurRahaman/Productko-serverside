const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = mongoose.Schema(
   {
      product: {
         type: ObjectId,
         ref: "Product",
         required: [true, "please provide a product id"],
      },
      price: {
         type: Number,
         min: [0, `price shouldn't be negative`],
         required: [true, "please provide a valid number"],
      },
      category: {
         type: ObjectId,
         ref: "Category",
         required: [true, "please provide category Id"],
      },
      sellerInfo: {
         id: {
            type: ObjectId,
            ref: "User",
            required: [true, "please provide a seller id"],
         },
         email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, "please provide a valid email"],
            required: [true, "please provide an email address"],
         },
         location: {
            type: String,
            required: true,
         },
         phone: {
            type: String,
            validate: [validator.isMobilePhone, "please provide a valid phone"],
            required: true,
         },
      },
      buyerInfo: {
         id: {
            type: ObjectId,
            ref: "User",
            required: [true, "please provide a buyer id"],
         },
         email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, "please provide a valid email"],
            required: [true, "please provide an email address"],
         },
         location: {
            type: String,
            required: true,
         },
         phone: {
            type: String,
            validate: [validator.isMobilePhone, "please provide a valid phone"],
            required: true,
         },
      },
      status: {
         type: String,
         enum: {
            values: ["pending", "paid", "canceled"],
            message: "{VALUE} shouldn't be status",
         },
      },
   },
   {
      timestamps: true,
   }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
