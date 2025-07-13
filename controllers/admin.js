const {
  HashedPasswordFunc,
  ComparePasswordFunc,
} = require("../helpers/hashing");
const { generateToken } = require("../middlewares/jwtCheck");
const AdminDB = require("../models/admin");

// Create a new admin
exports.createAdmin = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const profile = req.file && req.file.destination + "/" + req.file.filename;

  const checkEmail = await AdminDB.findOne({ email });

  if (checkEmail) {
    return res.status(400).json({
      success: false,
      message: "Admin is already registered",
      data: {},
    });
  }

  const HashedPassword = await HashedPasswordFunc(password);

  const adminData = await AdminDB.create({
    firstName,
    lastName,
    email,
    image: profile,
    password: HashedPassword,
  });

  if (!adminData) {
    return res.status(400).json({
      success: false,
      message: "Couldn't create admin",
      data: {},
    });
  }

  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: adminData,
  });
};

// Admin login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const adminData = await AdminDB.findOne({ email }).select("+password").lean();

  if (!adminData || adminData.isDeleted) {
    return res.status(404).json({
      success: false,
      message: adminData?.isDeleted
        ? "Admin has been deleted"
        : "Email or password is invalid",
      data: {},
    });
  }

  const HashedPassword = await ComparePasswordFunc(
    password,
    adminData.password
  );

  if (!HashedPassword) {
    return res.status(404).json({
      success: false,
      message: "Email or password is invalid",
      data: {},
    });
  }

  const token = generateToken({ userId: adminData._id });

  delete adminData["password"];

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: adminData,
    hostURL: `${req.protocol}://${req.get("host")}/`,
    token,
  });
};

// Update admin profile
exports.updateAdmin = async (req, res) => {
  const { firstName, lastName, image } = req.body;

  const isAdminAuth = req.isAdminAuth
  const adminId = req.adminId;

  if (!isAdminAuth) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      data: {},
    });
  }

  const profile = req.file && req.file.destination + "/" + req.file.filename;

  const adminData = await AdminDB.findByIdAndUpdate(
    adminId,
    {
      firstName,
      lastName,
      image: profile,
    },
    { new: true }
  );

  if (!adminData) {
    return res.status(400).json({
      success: false,
      message: "Couldn't update admin",
      data: {},
    });
  }

  res.status(200).json({
    success: true,
    message: "Admin updated successfully",
    data: adminData,
  });
};

// Request to change admin password (WIP)
exports.changeAdminPassword = async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      data: {},
    });
  }

  const checkEmail = await AdminDB.findOne({ email });

  if (!checkEmail) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
      data: {},
    });
  }

  // email services to be implement

  return res.send("Testing stage");

  if (!checkEmail) {
    return res.status(400).json({
      success: false,
      message: "Couldn't update admin",
      data: {},
    });
  }

  res.status(200).json({
    success: true,
    message: "Admin updated successfully",
    data: checkEmail,
  });
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  const adminId = req.body.userId;
  const isAdminAuth = req.isAdminAuth

  if (!isAdminAuth) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      data: {},
    });
  }


  const adminData = await AdminDB.findByIdAndUpdate(
    adminId,
    { isDeleted: true },
    { new: true }
  );

  if (!adminData) {
    return res.status(400).json({
      success: false,
      message: "Couldn't delete admin",
      data: {},
    });
  }

  res.status(200).json({
    success: true,
    message: "Admin deleted successfully",
    data: adminData,
  });
};
