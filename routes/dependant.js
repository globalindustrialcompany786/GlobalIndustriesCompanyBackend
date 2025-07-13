const Router = require("express").Router();
const {
  updateDependant,
  downloadOfferLetter,
} = require("../controllers/dependant");
const { verifyToken } = require("../middlewares/jwtCheck");
const { uploadDoc } = require("../middlewares/multerUpload");

// user & admin
Router.route("/update-dependant").put(
  verifyToken,
  uploadDoc.single("offerLetter"),
  updateDependant
);

// user & admin
Router.route("/download-offer-letter").get(verifyToken, downloadOfferLetter);

module.exports = Router;
