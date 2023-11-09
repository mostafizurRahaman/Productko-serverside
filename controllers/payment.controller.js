const { createPaymentService } = require("../services/payment.service");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SK);

exports.createPaymentIntent = async (req, res, next) => {
   try {
      const { price } = req.body;
      if (!price) {
         return res.status(200).send({
            status: "failed",
            message: "please provide booking details",
         });
      }
      // console.log(price);
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
         amount: amount,
         currency: "usd",
         payment_method_types: ["card"],
      });

      res.status(200).send({
         status: "success",
         message: "Payment Intent Created successfully",
         data: {
            clientSecret: paymentIntent.client_secret,
         },
      });
   } catch (err) {
      next(err);
   }
};

exports.createPayment = async (req, res, next) => {
   try {
      console.log(req.body);
      const payment = await createPaymentService(req.body);
      res.status(200).send({
         status: "success",
         message: "payment created successfully",
         data: payment,
      });
   } catch (err) {
      next(err);
   }
};
