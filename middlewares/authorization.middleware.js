exports.authorization = (...role) => {
   return (req, res, next) => {
      if (!role.includes(req.req.role)) {
         return res.status(401).send({
            status: "failed",
            message: "UnAuthorized User",
         });
      }
      next();
   };
};
