const Router = require("express").Router();
const {
  createUser,
  loginUser,
  updateUser,
  deactivateUser,
} = require("../controllers/user");
const { verifyToken } = require("../middlewares/jwtCheck");
const { uploadFile } = require("../middlewares/multerUpload");

Router.route("/register-user").post(uploadFile.single("profile"), createUser);
Router.route("/login-user").post(loginUser);
Router.route("/deactivate-user").post(verifyToken, deactivateUser);
Router.route("/update-user").put(verifyToken,uploadFile.single("profile"), updateUser);

module.exports = Router;
