const Product = require("../models/product.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");

exports.getAllProductService = async (filter, queryObject) => {
   console.log("product", filter, queryObject);
   const products = await Product.find(filter)
      .populate("sellerInfo.id")
      .skip(queryObject.skip)
      .limit(queryObject.limit);
   const totalProducts = await Product.countDocuments(filter);
   const page = Math.ceil(totalProducts / queryObject.limit);
   return { totalProducts, page, products };
};

exports.createProductService = async (data) => {
   const product = new Product(data);
   const result = await product.save();
   const { _id: productId, category, sellerInfo } = result;

   //  include product to category :
   const updateCategory = await Category.updateOne(
      { _id: category },
      { $push: { products: productId } },
      {
         runValidators: true,
      }
   );

   //  include product on user model:
   const updateUser = await User.updateOne(
      { _id: sellerInfo.id },
      { $push: { products: productId } },
      { runValidators: true }
   );
   console.log(updateCategory, updateUser);

   return result;
};

exports.getProductByIdService = async (id) => {
   const product = await Product.findById(id);
   return product;
};

exports.updateProductByIdService = async (id, data) => {
   const result = await Product.updateOne(
      { _id: id },
      { $set: data },
      { runValidators: true }
   );
   return result;
};

exports.deleteProductByIdService = async (id) => {
   const result = await Product.deleteOne({ _id: id });
   return result;
};
