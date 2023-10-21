const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.cotroller");

router
   .route("/")
   .get(productController.getAllProduct)
   .post(productController.createProduct);

router.route("/:id").get(productController.getSingleProductById);
// .patch(productController.updateProductById)
// .delete(productController.deleteProductById);

module.exports = router;
