const mongoose = require("mongoose");
const validator = require("validator");
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
   },
   {
      timestamps: true,
   }
);

// userSchema.pre("save", function (next) {
//    this.password = bcrypt.hashSync(this.password, 10);
//    next();
// });

// userSchema.methods.comparePassword = (password, hash) => {
//    return bcrypt.compareSync(password, hash);
// };

userSchema.methods.createJWT = function () {
   const payload = { email: this.email, role: this.role };
   const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "7d",
   });
   return accessToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
