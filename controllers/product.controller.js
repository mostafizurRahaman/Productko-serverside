const {
   getAllProductService,
   createProductService,
   getProductByIdService,
   deleteProductByIdService,
   updateProductByIdService,
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

exports.getSingleProductById = async (req, res, next) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).send({
            status: "failed",
            message: "please provide a product id",
         });
      }

      const product = await getProductByIdService(id);
      if (!product) {
         return res.status(400).send({
            status: "failed",
            message: "Product didn't find product with this id",
         });
      }

      res.status(200).send({
         status: "success",
         message: "Product found successfully",
         data: product,
      });
   } catch (err) {
      next(err);
   }
};

exports.updateProductById = async (req, res, next) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).send({
            status: "failed",
            message: "please provide a product id",
         });
      }

      const product = await getProductByIdService(id);
      if (!product) {
         return res.status(400).send({
            status: "failed",
            message: "Product didn't find product with this id",
         });
      }

      const result = await updateProductByIdService(id, req.body);
      if (!result.modifiedCount) {
         return res.status(400).send({
            status: "failed",
            message: "Product didn't update with this id",
         });
      }
      console.log(result);
      res.status(200).send({
         status: "success",
         message: "Product updated  successfully",
         data: result,
      });
   } catch (err) {
      next(err);
   }
};

exports.deleteProductById = async (req, res, next) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).send({
            status: "failed",
            message: "please provide a product id",
         });
      }

      const product = await getProductByIdService(id);
      if (!product) {
         return res.status(400).send({
            status: "failed",
            message: "Product didn't find product with this id",
         });
      }

      const { _id: productId, sellerInfo, category } = product;

      const result = await deleteProductByIdService(
         productId,
         sellerInfo.id,
         category
      );

      if (!result.deletedCount) {
         return res.status(400).send({
            status: "failed",
            message: `product didn't delete with this id`,
         });
      }
      res.status(200).send({
         status: "success",
         message: "Product delete successfully",
         data: result,
      });
   } catch (err) {
      next(err);
   }
};
