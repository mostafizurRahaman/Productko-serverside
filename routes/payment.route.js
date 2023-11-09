const express = require("express");
const { verifyJWT } = require("../middlewares/verifyJWT.middleware");
const paymentController = require("../controllers/payment.controller");
const router = express.Router();
router.use(verifyJWT);
router
   .route("/create-payment-intent")
   .post(paymentController.createPaymentIntent);

router.route("/").post(paymentController.createPayment);

module.exports = router;
