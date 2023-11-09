const Booking = require("../models/booking.modle");
const Payment = require("../models/payment.model");
const Product = require("../models/product.model");
exports.createPaymentService = async (data) => {
   const payment = new Payment(data);
   const result = await payment.save();
   console.log(result);
   const { product, booking } = payment;
   const productUpdate = await Product.updateOne(
      { _id: product },
      { $set: { payStatus: "paid" } },
      { runValidators: true }
   );

   const bookingUpdate = await Booking.updateOne(
      { _id: booking },
      { $set: { status: "paid" } },
      {
         runValidators: true,
      }
   );
   console.log("update", productUpdate);
   console.log("update booking", bookingUpdate);
   return payment;
};
