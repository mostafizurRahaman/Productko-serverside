const Booking = require("../models/booking.modle");
const Product = require("../models/product.model");
const User = require("../models/user.model");

exports.getAllBookingService = async (filter, queryObject) => {
   console.log("bookings", filter, queryObject);
   const bookings = await Booking.find(filter)
      .populate("buyerInfo.id")
      .populate("product")
      .skip(queryObject.skip)
      .limit(queryObject.limit);
   const totalBookings = await Booking.countDocuments(filter);
   const limit = queryObject.limit || 0;
   const page = Math.ceil(totalBookings / limit);
   return { totalBookings, page, bookings };
};

module.exports.createBookingService = async (data) => {
   const booking = new Booking(data);
   const result = await booking.save();
   if (result) {
      const { _id: bookingId, buyerInfo, product } = result;
      // update product status: available to booked:
      const updateProductStatus = await Product.findOneAndUpdate(
         { _id: product },
         { $set: { status: "booked" } },
         { runValidators: true }
      );

      //  include booked Product to user model:
      const updateUserBookInfo = await User.findOneAndUpdate(
         { _id: buyerInfo.id },
         {
            $push: {
               bookings: bookingId,
            },
         },
         {
            runValidators: true,
         }
      );
      console.log(updateProductStatus, updateUserBookInfo);
   }

   return result;
};

exports.getSingleBookingServiceById = async (id) => {
   const booking = await Booking.findById(id)
      .populate("buyerInfo.id")
      .populate("product");
   return booking;
};

exports.deleteBookingServiceById = async (bookingId, productId, buyerId) => {
   const result = await Booking.deleteOne({ _id: bookingId });
   if (result.deletedCount) {
      const updateProductStatus = await Product.findOneAndUpdate(
         { _id: productId },
         { $set: { status: "available" } },
         { runValidators: true }
      );

      const updateBuyerBookings = await User.findOneAndUpdate(
         { _id: buyerId },
         { $pull: { bookings: bookingId } },
         { runValidators: true }
      );

      console.log(result, updateBuyerBookings, updateProductStatus);
   }

   return result;
};
