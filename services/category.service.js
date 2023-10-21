const Category = require("../models/category.model");

module.exports.getAllCategoryService = async () => {
   const categories = await Category.find();
   return categories;
};

module.exports.createCategoryService = async (data) => {
   const category = new Category(data);
   const result = await category.save();
   return result;
};

module.exports.getCategoryByIdService = async (categoryId) => {
   // const category = await Category.findById(categoryId).populate("products");
   const category = await Category.findById(categoryId)
   return category;
};

module.exports.updateCategoryByIdService = async (categoryId, updatedData) => {
   const result = await Category.updateOne(
      { _id: categoryId },
      { $set: updatedData },
      { runValidators: true }
   );
   return result;
};

module.exports.deleteCategoryByIdService = async (categoryId) => {
   const result = await Category.deleteOne({ _id: categoryId });
   return result;
};
