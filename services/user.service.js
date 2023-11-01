const User = require("../models/user.model");

exports.getAllUserService = async (filter, queryObject) => {
   // console.log("user qeury", filter, queryObject);
   const users = await User.find(filter)
      .skip(queryObject.skip)
      .limit(queryObject.limit);
   const totalUsers = await User.countDocuments(filter);
   const page = Math.ceil(totalUsers / queryObject.limit);
   return { totalUsers, page, users };
};

exports.singUpService = async (data) => {
   const user = new User(data);
   const result = await user.save();
   return result;
};

exports.findUserByEmailService = async (email) => {
   const user = await User.findOne({ email });
   return user;
};

exports.findUserByIdService = async (userId) => {
   const user = await User.findById(userId);
   return user;
};

exports.updateUserServiceById = async (id, data) => {
   const result = await User.updateOne(
      { _id: id },
      { $set: data },
      {
         runValidators: true,
      }
   );
   return result;
};

exports.deleteUserServiceById = async (id) => {
   const result = await User.deleteOne({ _id: id });
   console.log('delete user', result);
   return result;
};
