const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/verifyJW.middleware");

router.route("/me").get(verifyJWT, userController.getMe);
router.route("/").get(userController.getAllUsers).post(userController.signUp);

router
   .route("/:id")
   .get(userController.getUserById)
   .patch(userController.updateUserById)
   .delete(userController.deleteUserById);

module.exports = router;
