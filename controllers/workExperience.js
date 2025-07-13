const WorkExperienceDB = require("../models/workExperience");

// exports.createWorkExperience = async (req, res) => {
//   const { previousCompany, role, fromDate, toDate, jobDescription } = req.body;
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

//   const workExperienceData = await WorkExperienceDB.create({
//     previousCompany,
//     userId,
//     role,
//     fromDate,
//     toDate,
//     jobDescription,
//   });

//   if (!workExperienceData) {
//     return res.status(400).json({
//       success: false,
//       message: "Couldn't add work experience data",
//       data: {},
//     });
//   }

//   res.status(201).json({
//     success: true,
//     message: "Added work experience data successfully",
//     data: workExperienceData,
//   });
// };

exports.updateWorkExperience = async (req, res) => {
  const { previousCompany, role, fromDate, toDate, jobDescription } = req.body;
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

  const experienceLetter = req.file && req.file.destination+"/"+req.file.filename;

  const checkWorkExperience = await WorkExperienceDB.findOne({ userId });

  if (!checkWorkExperience) {
    const workExperienceData = await WorkExperienceDB.create({
      previousCompany,
      userId,
      role,
      fromDate,
      toDate,
      jobDescription,
      experienceLetter
    });

    if (!workExperienceData) {
      return res.status(400).json({
        success: false,
        message: "Couldn't add work experience data",
        data: {},
      });
    }

    return res.status(201).json({
      success: true,
      message: "Added work experience data successfully",
      data: workExperienceData,
    });
  }

  const workExperienceData = await WorkExperienceDB.findByIdAndUpdate(
    checkWorkExperience._id,
    {
      previousCompany,
      role,
      fromDate,
      toDate,
      jobDescription,
      experienceLetter
    },
    { new: true }
  );

  if (!workExperienceData) {
    return res.status(400).json({
      success: false,
      message: "Couldn't update work experience data",
      data: {},
    });
  }

  res.status(200).json({
    success: true,
    message: "Work experience data updated successfully",
    data: workExperienceData,
  });
};
