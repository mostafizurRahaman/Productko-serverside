const {
   getAllProductService,
   createProductService,
} = require("../services/product.service");

exports.getAllProduct = async (req, res, next) => {
   try {
      const filter = { ...req.query };
      const queryObject = {};
      const excludedFields = ["sort", "limit", "page"];
      excludedFields.map((i) => delete filter[i]);

      if (req.query.page) {
         const { page = 1, limit = 0 } = req.query;
         queryObject.skip = (page - 1) * (limit * 1);
         queryObject.limit = limit * 1;
      }

      const products = await getAllProductService(filter, queryObject);
      res.status(200).send({
         status: "success",
         message: "Product Found successfully",
         data: products,
      });
   } catch (err) {
      next(err);
   }
};

exports.createProduct = async (req, res, next) => {
   try {
      const product = await createProductService(req.body);
      res.status(200).send({
         status: "success",
         message: "product created successfully",
         data: product,
      });
   } catch (err) {
      next(err);
   }
};
