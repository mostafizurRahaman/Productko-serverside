const {
   getCategoryByIdService,
   getAllCategoryService,
   createCategoryService,
   updateCategoryByIdService,
   deleteCategoryByIdService,
} = require("../services/category.service");

module.exports.getAllCategory = async (req, res, next) => {
   try {
      const categories = await getAllCategoryService();
      res.status(200).send({
         status: "success",
         message: "Categories found successfully",
         data: categories,
      });
   } catch (err) {
      next(err);
   }
};

module.exports.createCategory = async (req, res, next) => {
   try {
      const category = await createCategoryService(req.body);
      res.status(200).send({
         status: "success",
         message: "category created successfully",
         data: category,
      });
   } catch (err) {
      next(err);
   }
};

module.exports.getCategoryById = async (req, res, next) => {
   try {
      const { id } = req.params;
      const category = await getCategoryByIdService(id);
      if (!category) {
         return res.status(400).send({
            status: "failed",
            message: `Category didn't find with this id ${id}`,
         });
      }
      res.status(200).send({
         status: "success",
         message: "Category found successfully",
         data: category,
      });
   } catch (err) {
      next(err);
   }
};

module.exports.updateCategoryById = async (req, res, next) => {
   try {
      const { id } = req.params;
      const category = await getCategoryByIdService(id);
      if (!category) {
         return res.status(400).send({
            status: "failed",
            message: `Category didn't find with this id ${id}`,
         });
      }

      const result = await updateCategoryByIdService(id, req.body);
      if (!result.modifiedCount) {
         return res.status(400).send({
            status: "failed",
            message: `Category didn't update with this ${id}`,
         });
      }

      res.status(200).send({
         status: "success",
         message: "Category updated successfully",
         data: result,
      });
   } catch (err) {
      next(err);
   }
};

module.exports.deleteCategoryById = async (req, res, next) => {
   try {
      const { id } = req.params;
      const category = await getCategoryByIdService(id);
      if (!category) {
         return res.status(400).send({
            status: "failed",
            message: `Category didn't find with this id ${id}`,
         });
      }

      const result = await deleteCategoryByIdService(id);
      if (!result.deletedCount) {
         return res.status(400).send({
            status: "failed",
            message: `Category didn't delete with this ${id}`,
         });
      }

      res.status(200).send({
         status: "success",
         message: "Category deleted successfully",
         data: result,
      });
   } catch (err) {
      next(err);
   }
};
