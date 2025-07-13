const Router = require("express").Router();
const { updateWorkExperience } = require("../controllers/workExperience");
const { verifyToken } = require("../middlewares/jwtCheck");
const { uploadDoc } = require("../middlewares/multerUpload");

// user & admin
Router.route("/update-workExperience").put(verifyToken, uploadDoc.single("experienceLetter"), updateWorkExperience);

module.exports = Router;
