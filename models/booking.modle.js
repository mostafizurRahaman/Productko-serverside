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
      sellerInfo: {
         type: ObjectId,
         ref: "User",
         required: [true, "please provide a seller id"],
      },
      buyerInfo: {
         type: ObjectId,
         ref: "User",
         required: [true, "please provide a buyer id"],
      },
      status: {
         values: ["pending", "paid", "canceled"],
         message: "{VALUE} shouldn't be status",
      },
   },
   {
      timestamps: true,
   }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
