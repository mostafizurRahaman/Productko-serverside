const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = mongoose.Schema(
   {
      name: {
         type: String,
         lowercase: true,
         trim: true,
         required: [true, "please provide a valid name"],
      },
      email: {
         type: String,
         lowercase: true,
         trim: true,
         unique: true,
         validate: [validator.isEmail, "please provide a valid email address"],
         required: [true, "please provide an email address"],
      },
      photoURL: {
         type: String,
         validate: [validator.isURL, "please provide a valid URL"],
         required: [true, "Please provide a valid URL"],
      },
      role: {
         type: String,
         enum: {
            values: ["admin", "seller", "buyer"],
            message: `{VALUE} shouldn't be  role`,
         },
         required: [true, "please provide a role "],
      },
      isVerified: Boolean,
      products: [
         {
            type: ObjectId,
            ref: "Product",
            required: [true, "please provide a product id"],
         },
      ],
      bookings: [
         {
            type: ObjectId,
            ref: "Booking",
            required: [true, "please provide a booking id"],
         },
      ],
   },
   {
      timestamps: true,
   }
);

userSchema.methods.createJWT = function () {
   const payload = { email: this.email, role: this.role };
   const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "7d",
   });
   return accessToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
