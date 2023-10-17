const express = require("express");
const categoryController = require("../controllers/category.controller");
const router = express.Router();

router
   .route("/")
   .get(categoryController.getAllCategory)
   .post(categoryController.createCategory);

router
   .route("/:id")
   .get(categoryController.getCategoryById)
   .patch(categoryController.updateCategoryById)
   .delete(categoryController.deleteCategoryById);

module.exports = router;
