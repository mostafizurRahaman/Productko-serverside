const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller.js");

router
   .route("/")
   .get(bookingController.getBookings)
   .post(bookingController.createBooking);

router
   .route("/:id")
   .get(bookingController.getSingleBookingById)
   .delete(bookingController.deleteBookingById);
module.exports = router;
