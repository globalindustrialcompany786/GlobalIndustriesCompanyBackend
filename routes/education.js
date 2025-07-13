const Router = require("express").Router();
const { updateEducation } = require("../controllers/education");
const { verifyToken } = require("../middlewares/jwtCheck");
const { uploadFile, uploadDoc } = require("../middlewares/multerUpload");

// user & admin
Router.route("/update-education").put(verifyToken, uploadDoc.single("document"), updateEducation);

module.exports = Router;
