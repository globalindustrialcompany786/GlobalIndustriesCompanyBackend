const EducationDB = require("../models/education");

// exports.createEducation = async (req, res) => {
//   const {
//     schoolName,
//     degree,
//     fieldOfStudy,
//     yearOfCompletion,
//     notes,
//     interests,
//   } = req.body;

//   let userId = req.userId;

//   if (req.isAdminAuth) {
//     userId = req.query.userId;
//   }

//   if (!userId) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid user",
//       data: {},
//     });
//   }

//   const educationData = await EducationDB.create({
//     schoolName,
//     userId,
//     degree,
//     fieldOfStudy,
//     yearOfCompletion,
//     notes,
//     interests,
//   });

//   if (!educationData) {
//     return res.status(400).json({
//       success: false,
//       message: "Couldn't add education data",
//       data: {},
//     });
//   }

//   res.status(201).json({
//     success: true,
//     message: "Added education data successfully",
//     data: educationData,
//   });
// };

exports.updateEducation = async (req, res) => {
  const {
    schoolName,
    degree,
    fieldOfStudy,
    yearOfCompletion,
    notes,
    interests,
  } = req.body;

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

  const document = req.file && req.file.destination+"/"+req.file.filename;

  const checkEducation = await EducationDB.findOne({ userId });

  if (!checkEducation) {
    const educationData = await EducationDB.create({
      schoolName,
      userId,
      degree,
      fieldOfStudy,
      yearOfCompletion,
      notes,
      interests,
      document
    });

    if (!educationData) {
      return res.status(400).json({
        success: false,
        message: "Couldn't add education data",
        data: {},
      });
    }

    return res.status(201).json({
      success: true,
      message: "Added education data successfully",
      data: educationData,
    });
  }

  const educationData = await EducationDB.findByIdAndUpdate(
    checkEducation._id,
    {
      schoolName,
      degree,
      fieldOfStudy,
      yearOfCompletion,
      notes,
      interests,
      document
    },
    { new: true }
  );

  if (!educationData) {
    return res.status(400).json({
      success: false,
      message: "Couldn't update education data",
      data: {},
    });
  }

  res.status(200).json({
    success: true,
    message: "Education data updated successfully",
    data: educationData,
  });
};
