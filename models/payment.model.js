const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const paymentSchema = mongoose.Schema(
   {
      product: {
         type: ObjectId,
         ref: "Product",
         required: true,
      },
      buyer: {
         type: ObjectId,
         ref: "User",
         required: true,
      },
      transaction: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
