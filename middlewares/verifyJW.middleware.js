const jwt = require("jsonwebtoken");
const { promisify } = require("util");
require("dotenv").config();

exports.verifyJWT = async (req, res, next) => {
   try {
      const token = req.headers?.authorization.split(" ")[1];
      // console.log(token);
      if (!token) {
         return res.status(401).send({
            status: "failed",
            message: "Your are not logged In",
         });
      }

      // console.log("process", process.env.ACCESS_TOKEN);
      const decoded = await promisify(jwt.verify)(
         token,
         process.env.ACCESS_TOKEN
      );

      req.user = decoded;
      // console.log("decoded", decoded);
      next();
   } catch (err) {
      throw new Error("unauthorized user");
   }
};