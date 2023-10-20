const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/verifyJW.middleware");

router.route("/me").get(verifyJWT, userController.getMe);
router.route("/jwt").get(userController.getJWT);
router.route("/sign-up").post(userController.signUp);
router.route("/").get(userController.getAllUsers);

router
   .route("/:id")
   .get(userController.getUserById)
   .patch(userController.updateUserById)
   .delete(userController.deleteUserById);

module.exports = router;
