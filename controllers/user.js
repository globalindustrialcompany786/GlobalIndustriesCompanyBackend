const { generateToken, verifyToken } = require("../middlewares/jwtCheck");
// const { compressImage, test } = require("../middlewares/multerUpload");
const UserDB = require("../models/user");
const EducationDB = require("../models/education");
const DependantDB = require("../models/dependant");
const WorkExperienceDB = require("../models/workExperience");

// Create a new user (for admin)
exports.createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    employeeId,
    password,
    department,
    dateOfHire,
    employeeStatus,
    employeeType,
    title,
    sourceOfHire,
    workPhone,
    address1,
    address2,
    city,
    state,
    country,
    mobile,
    otherEmail,
    gender,
    salary,
    payType,
    maritalStatus,
    passportNumber,
    dateOfBirth,
  } = req.body;

  const profile = req.file && req.file.destination+"/"+req.file.filename;
  
  const checkEmail = await UserDB.findOne({ email });
  const checkEmployeeId = await UserDB.findOne({ employeeId });

  if (checkEmail || checkEmployeeId) {
    return res.status(400).json({
      success: false,
      message: `Please send a unique ${checkEmail ? "email" : "employeeId"}`,
      data: {},
    });
  }

  const userData = await UserDB.create({
    firstName,
    lastName,
    email,
    employeeId,
    password,
    image: profile,
    department,
    dateOfHire,
    employeeStatus,
    employeeType,
    title,
    sourceOfHire,
    workPhone,
    salary,
    payType,
    passportNumber,
    personalDetails: {
      address1,
      address2,
      city,
      state,
      country,
      mobile,
      otherEmail,
      gender,
      maritalStatus,
      dateOfBirth,
    },
  });

  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "Couldn't create user",
      data: {},
    });
  }

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: userData,
  });
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const userData = await UserDB.findOne({ email, password })
    .select("+password")
    .lean();

  if (!userData) {
    return res.status(404).json({
      success: false,
      message: "Email or password is invalid",
      data: {},
    });
  }

  if (userData.isDeleted || !userData.isActive) {
    return res.status(404).json({
      success: false,
      message: userData.isDeleted
        ? "User has been deleted"
        : "Your account is deactivated, please connect with admin",
      data: {},
    });
  }

  const token = generateToken({ userId: userData._id });
  delete userData["password"];

  const userEducationData = EducationDB.findOne({ userId: userData._id });
  const userDependantData = DependantDB.findOne({ userId: userData._id });
  const userWorkExperienceData = WorkExperienceDB.findOne({
    userId: userData._id,
  });

  const newArr = await Promise.all([
    userEducationData,
    userDependantData,
    userWorkExperienceData,
  ])
    .then((results) => {
      const education = results[0] ?? {};
      const dependant = results[1] ?? {};
      const workExperience = results[2] ?? {};
      return { education, dependant, workExperience };
    })
    .catch((error) => {
      console.log("something went wrong");
    });

  let finalData = { ...newArr, ...userData };

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: finalData,
    token,
  });
};

// Update user
exports.updateUser = async (req, res) => {
  let userId = req.userId;
  
  const profile = req.file && req.file.destination+"/"+req.file.filename;
  
  let allObj = { 
    image: profile 
  };


  if (req.isAdminAuth) {
    userId = req.query.userId;
    const {
      firstName,
      lastName,
      employeeId,
      department,
      dateOfHire,
      employeeStatus,
      employeeType,
      title,
      sourceOfHire,
      workPhone,
      salary,
      payType,
      passportNumber,
    } = req.body;

    allObj = {
      firstName,
      lastName,
      employeeId,
      image: profile,
      department,
      dateOfHire,
      employeeStatus,
      employeeType,
      title,
      sourceOfHire,
      workPhone,
      salary,
      payType,
      passportNumber,
    };
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Invalid user",
      data: {},
    });
  }

  const {
    address1,
    address2,
    city,
    state,
    country,
    mobile,
    otherEmail,
    gender,
    maritalStatus,
    dateOfBirth,
  } = req.body;

  const userData = await UserDB.findByIdAndUpdate(
    userId,
    {
      ...allObj,
      personalDetails: {
        address1,
        address2,
        city,
        state,
        country,
        mobile,
        otherEmail,
        gender,
        maritalStatus,
        dateOfBirth,
      },
    },
    { new: true }
  );

  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "Couldn't update user",
      data: {},
    });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: userData,
  });
};

// Delete user
exports.deactivateUser = async (req, res) => {
  if (!req.isAdminAuth) {
    return res.status(401).json({
      success: false,
      message: "unauth request",
      data: [],
    });
  }

  const userId = req.query.userId;

  const userData = await UserDB.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true }
  );

  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "Couldn't deactivate user",
      data: {},
    });
  }

  res.status(200).json({
    success: true,
    message: "User deactivated successfully",
    data: userData,
  });
};

// Delete user
exports.deleteUser = async (req, res) => {
  if (!req.isAdminAuth) {
    return res.status(401).json({
      success: false,
      message: "unauth request",
      data: [],
    });
  }

  const userId = req.query.userId;

  await DependantDB.findOneAndDelete({ userId });
  await WorkExperienceDB.findOneAndDelete({ userId });
  await UserDB.findOneAndDelete({ _id: userId });

  // if (!userData) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Couldn't delete user",
  //     data: {},
  //   });
  // }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: {},
  });
};

// Get all users
exports.getAllUser = async (req, res) => {
  if (!req.isAdminAuth) {
    return res.status(401).json({
      success: false,
      message: "unauth request",
      data: [],
    });
  }

  const userData = await UserDB.find({ isDeleted: false }).select("+password");

  res.status(200).json({
    success: true,
    message: userData.length ? "Users fetched successfully" : "No data found",
    data: userData,
  });
};

// Get one user by userId (using query parameter)
exports.getOneUser = async (req, res) => {
  let userId = req.userId;

  if (req.isAdminAuth) {
    userId = req.query.userId;
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Invalid user",
      data: {},
    });
  }

  const userData = await UserDB.findOne({ _id: userId })
    .select("+password")
    .lean();

  if (!userData) {
    return res.status(404).json({
      success: false,
      message: "No data found",
      data: [],
    });
  }

  const userEducationData = EducationDB.findOne({ userId: userData._id });
  const userDependantData = DependantDB.findOne({ userId: userData._id });
  const userWorkExperienceData = WorkExperienceDB.findOne({
    userId: userData._id,
  });

  const newArr = await Promise.all([
    userEducationData,
    userDependantData,
    userWorkExperienceData,
  ])
    .then((results) => {
      const education = results[0] ?? {};
      const dependant = results[1] ?? {};
      const workExperience = results[2] ?? {};
      return { education, dependant, workExperience };
    })
    .catch((error) => {
      console.log("something went wrong");
    });

  let finalData = { ...newArr, ...userData };

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: finalData,
  });
};
