const UserDB = require("../models/user");
const converter = require("json-2-csv");
const ejs = require("ejs");
const path = require("path");
const htmlToPdf = require("html-pdf");

exports.exportUserData = async (req, res) => {
  try {
    const usersData = await UserDB.find({}, { updatedAt: 0, __v: 0 }).lean();
    const csvRecord = await converter.json2csv(usersData, {
      useLocaleFormat: true,
    });

    res.set("Content-Type", "text/csv");
    res.status(200).send(csvRecord);
  } catch (err) {
    console.log("[CSV Error]", JSON.stringify(err));
  }
};

exports.generateUserPdf = async (req, res) => {
  const userData = await UserDB.findById(req.user).lean();

  const getUserTasks = await UserDB.find({
    user: userData._id,
    isDeleted: false,
  });

  const finalData = Object.assign(userData, { task: getUserTasks });
  console.log("===================>",finalData)
  finalData["image"] = `${req.protocol}://${req.get("host")}/profile/${finalData?.image?.split("\\")[1]}`

  ejs.renderFile(
    path.join(__dirname, "../helpers/", "reportPDF.ejs"),
    { user: finalData },
    (err, data) => {
      if (err) console.log("[EJS ERROR]", err);

      htmlToPdf.create(data, { format: "A4" }).toBuffer((err, buff) => {
        if (err) console.log("[CONVERSION ERROR]", err);

        res.setHeader("Content-Type", "application/pdf");
        res.send(buff)
      });
    }
  );
};
