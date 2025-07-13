const JWT = require("jsonwebtoken");
const JWT_Secret = "vinaysecretkey";
const AdminDB = require("../models/admin");
const UserDB = require("../models/user");
const EducationDB = require("../models/education");
const DependantDB = require("../models/dependant");
const WorkExperienceDB = require("../models/workExperience");

exports.generateToken = (payload = {}) => {
  return JWT.sign(payload, JWT_Secret);
};

exports.verifyToken = async (req, res, next) => {
  try {
    const userData = JWT.verify(req.headers.token, JWT_Secret);

    if (!userData) {
      return res.send({ message: "invalid token" });
    }

    const checkAdmin = await AdminDB.findOne({
      _id: userData.userId,
      isDeleted: false,
    });

    if (checkAdmin) {
      req.userId = null;
      req.isAdminAuth = true;
      req.adminId = checkAdmin._id;
    } else {
      req.userId = userData.userId;
      req.isAdminAuth = false;
    }
    next();
  } catch (error) {
    return res.send("unauth request");
  }
};

const UserDataAPI = async (userId, doc) => {
  let check = false;

  const userData = await UserDB.findOne({ _id: userId }).lean();
  if (!userData) {
    check = false;
  }

  if (userData.isDeleted || !userData.isActive) {
    check = false;
  }

  const userEducationData = await EducationDB.findOne({ userId });
  const userWorkExperienceData = await WorkExperienceDB.findOne({ userId });
  const userDependantData = await DependantDB.findOne({ userId });

  if (
    userData.image.includes(doc) ||
    userEducationData.document.includes(doc) ||
    userWorkExperienceData.experienceLetter.includes(doc) ||
    userDependantData.offerLetter.includes(doc)
  ) {
    check = true;
  }else{
    check = false;
  }

  return check;
};

exports.verifyTokenUpload = async (req, res, next) => {
  try {
    if (req.url.includes("profile")) {
      next();
      return;
    }

    const userData = JWT.verify(req.headers.token, JWT_Secret);

    if (!userData) {
      return res.send({ message: "invalid token" });
    }

    const checkAdmin = await AdminDB.findOne({
      _id: userData.userId,
      isDeleted: false,
    });

    if (checkAdmin) {
      next();
      return;
    }

    const checkUser = await UserDataAPI(userData.userId, req.url);

    if (checkUser) {
      next();
    } else {
      throw new Error("unauth");
    }
  } catch (error) {
    return res.send("unauth request");
  }
};
