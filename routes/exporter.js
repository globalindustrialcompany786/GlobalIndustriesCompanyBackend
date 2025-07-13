const Router = require("express").Router();

const { exportUserData, generateUserPdf } = require("../controllers/exporter");
const { verifyToken } = require("../middlewares/jwtCheck");

Router.route("/generate-report").get(exportUserData);
Router.route("/generate-report-pdf").get(verifyToken, generateUserPdf);

module.exports = Router;
