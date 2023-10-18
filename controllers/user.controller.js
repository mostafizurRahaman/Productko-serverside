const {
   getAllUserService,
   findUserByEmailService,
   singUpService,
   findUserByIdService,
} = require("../services/user.service");

exports.getAllUsers = async (req, res, next) => {
   try {
      const filter = { ...req.query };
      const queryObject = {};
      const excludedFields = ["sort", "page", "limit"];
      excludedFields.map((i) => delete filter[i]);

      if (req.query.page) {
         const { page = 1, limit = 0 } = req.query;
         queryObject.skip = (page - 1) * (limit * 1);
         queryObject.limit = limit * 1;
      }

      const users = await getAllUserService(filter, queryObject);
      res.status(200).send({
         status: "success",
         message: "Users found successfully",
         data: users,
      });
   } catch (err) {
      next(err);
   }
};

exports.signUp = async (req, res, next) => {
   try {
      const { email } = req.body;
      const userExist = await findUserByEmailService(email);
      if (userExist?.email) {
         return res.status(200).send({
            status: "success",
            message: "Github/Google login successfully",
            data: userExist,
         });
      }
      const user = await singUpService(req.data);
      res.status(200).send({
         status: "success",
         message: "user registered successfully",
         data: user,
      });
   } catch (err) {
      next(err);
   }
};

exports.getUserById = async (req, res, next) => {
   try {
      const { id } = req.params;
      const user = await findUserByIdService(id);
      if (!user) {
         return res.status(400).send({
            status: "failed",
            message: "user didn't exist with this id",
         });
      }
      res.status(200).send({
         status: "success",
         message: "user found successfully with this id",
         data: user,
      });
   } catch (err) {
      next(err);
   }
};

exports.deleteUserById = async (req, res, next) => {
   try {
      const { id } = req.params;
      const user = await findUserByIdService(id);
      if (!user) {
         return res.status(400).send({
            status: "failed",
            message: "User didn't exist with this id",
         });
      }
      const result = await deleteUserByService(id);
      if (!result.deletedCount) {
         return res.status(400).send({
            status: "failed",
            message: "User didn't deleted",
         });
      }
      res.status(200).send({
         status: "success",
         message: "user deleted successfully",
         data: result,
      });
   } catch (err) {
      next(err);
   }
};
exports.updateUserById = async (req, res, next) => {
   try {
      const { id } = req.params;
      const user = await findUserByIdService(id);
      if (!user) {
         return res.status(400).send({
            status: "failed",
            message: "User didn't exist with this id",
         });
      }
      const result = await updateUserByIdService(id);
      if (!result.modifiedCount) {
         return res.status(400).send({
            status: "failed",
            message: "User didn't update",
         });
      }
      res.status(200).send({
         status: "success",
         message: "user updated successfully",
         data: result,
      });
   } catch (err) {
      next(err);
   }
};

exports.getJWT = async (req, res, next) => {
   try {
      const { email } = req.body;
      const user = await findUserByEmailService(email);
      if (!user) {
         return res.status(401).send({
            status: "message",
            message: "Your aren't registered",
         });
      }
      const accessToken = user.createJWT();
      res.status(200).send({
         status: "success",
         message: "Your are logged In",
         data: accessToken,
      });
   } catch (err) {
      next(err);
   }
};

exports.getMe = async (req, res, next) => {
   try {
      const email = req.user?.email;
      const user = await findUserByEmailService(email);
      if (!user) {
         res.status(400).send({
            status: "failed",
            message: "You are not logged In",
         });
      }
      res.status(200).send({
         status: "success",
         message: "Your are logged in",
         data: user,
      });
   } catch (err) {
      next(err);
   }
};
