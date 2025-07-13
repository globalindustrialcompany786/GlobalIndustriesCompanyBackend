const Router = require("express").Router();
const {
  createAdmin,
  loginAdmin,
  deleteAdmin,
  updateAdmin,
} = require("../controllers/admin");
const { getAllUser, getOneUser, deleteUser } = require("../controllers/user");
const { verifyToken } = require("../middlewares/jwtCheck");
const { uploadFile } = require("../middlewares/multerUpload");

// admin
Router.route("/register-admin").post(uploadFile.single("image"), createAdmin);
Router.route("/login-admin").post(loginAdmin);
Router.route("/put-admin").put(verifyToken, uploadFile.single("image"), updateAdmin);
Router.route("/delete-admin").delete(verifyToken, deleteAdmin);

// user
Router.route("/get-all-users").get(verifyToken, getAllUser);
Router.route("/get-one-users").get(verifyToken, getOneUser);
Router.route("/delete-one-user").delete(verifyToken, deleteUser);

module.exports = Router;
