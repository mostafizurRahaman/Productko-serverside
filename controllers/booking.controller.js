const {
   createBookingService,
   getAllBookingService,
   getSingleBookingServiceById,
   deleteBookingServiceById,
} = require("../services/booking.service");

exports.getBookings = async (req, res, next) => {
   try {
      const filter = { ...req.query };
      const queryObject = {};
      const excludedFields = ["page", "sort", "limit"];
      excludedFields.map((i) => delete filter[i]);

      if (req.query.page) {
         const { page = 1, limit = 0 } = req.query;
         queryObject.skip = (page - 1) * limit * 1;
         queryObject.limit = limit * 1;
      }

      const bookings = await getAllBookingService(filter, queryObject);

      res.status(200).send({
         status: "success",
         message: "bookings found successfully",
         data: bookings,
      });
   } catch (err) {
      next(err);
   }
};

exports.createBooking = async (req, res, next) => {
   try {
      console.log(req.body);
      const booking = await createBookingService(req.body);
      res.status(200).send({
         status: "success",
         message: "booking created successfully",
         data: booking,
      });
   } catch (err) {
      next(err);
   }
};

exports.getSingleBookingById = async (req, res, next) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).send({
            status: "failed",
            message: "Please provide an id",
         });
      }
      const booking = await getSingleBookingServiceById(id);
      if (!booking) {
         return res.status(400).send({
            status: "failed",
            message: "booking didn't find for this id",
         });
      }

      res.status(200).send({
         status: "success",
         message: "booking found successfully",
         data: booking,
      });
   } catch (err) {
      next(err);
   }
};

exports.deleteBookingById = async (req, res, next) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).send({
            status: "failed",
            message: "Please provide an id",
         });
      }
      const booking = await getSingleBookingServiceById(id);
      if (!booking) {
         return res.status(400).send({
            status: "failed",
            message: "booking didn't find for this id",
         });
      }
      console.log(booking);

      // const {_id: bookingId, }
      const { _id: bookingId, product, buyerInfo } = booking;
      const result = await deleteBookingServiceById(
         bookingId,
         product,
         buyerInfo.id._id
      );

      if (!result.deletedCount) {
         return res.status(400).send({
            status: "failed",
            message: "booking didn't deleted successfully",
         });
      }

      res.status(200).send({
         status: "success",
         message: "booking deleted successfully",
         data: result,
      });
   } catch (err) {
      next(err);
   }
};
