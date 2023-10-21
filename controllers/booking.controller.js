const {
   createBookingService,
   getAllBookingService,
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

