const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.verifyJWT = async (req, res, next) => {
   try {
      const token = req.headers?.authorization.split(" ")[1];
      if (!token) {
         return res.status(401).send({
            status: "failed",
            message: "your are not logged import {  } from 'next'",
         });
      }

      const decoded = await promisify(jwt.verify)(
         token,
         process.env.AccessToken
      );

      req.user = decoded;
      console.log("decoded", decoded);
   } catch (err) {
      throw new Error("unauthorized user");
   }
};
