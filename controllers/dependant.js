const path = require("path");
const DependantDB = require("../models/dependant");

// Update dependant data
exports.updateDependant = async (req, res) => {
  const { name, relation, dateOfBirth } = req.body;
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

  const checkDependant = await DependantDB.findOne({ userId });

  const offerLetter =
    req.file && req.file.destination + "/" + req.file.filename;

  if (!checkDependant) {
    const dependantData = await DependantDB.create({
      name,
      userId,
      relation,
      dateOfBirth,
      offerLetter,
    });

    if (!dependantData) {
      return res.status(400).json({
        success: false,
        message: "Couldn't add dependant data",
        data: {},
      });
    }

    return res.status(201).json({
      success: true,
      message: "Added dependant data successfully",
      data: dependantData,
    });
  }

  const dependantData = await DependantDB.findByIdAndUpdate(
    checkDependant._id,
    {
      name,
      relation,
      dateOfBirth,
      offerLetter,
    },
    { new: true }
  );

  if (!dependantData) {
    return res.status(400).json({
      success: false,
      message: "Couldn't update dependant data",
      data: {},
    });
  }

  res.status(200).json({
    success: true,
    message: "Dependant data updated successfully",
    data: dependantData,
  });
};

exports.downloadOfferLetter = async (req, res) => {
  try {
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

    const offerLetterData = await DependantDB.findOne({ userId });

    if (!offerLetterData) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find data",
        data: {},
      });
    }

    // const hostURL = `${req.protocol}://${req.get("host")}/`;
    // res.send(`${hostURL}${offerLetterData.offerLetter}`);

    res.sendFile(
      path.join(
        __dirname,
        "../uploads",
        offerLetterData.offerLetter.split("/")[1]
      )
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {},
    });
  }
};
