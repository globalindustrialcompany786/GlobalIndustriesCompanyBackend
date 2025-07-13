const mongoose = require("mongoose");

const workExperienceSchema = mongoose.Schema(
  {
    previousCompany: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "please enter userId"],
      ref: "user",
    },
    role: {
      type: String,
      default: "",
    },
    fromDate: {
      type: String,
      default: "",
    },
    toDate: {
      type: String,
      default: "",
    },
    jobDescription: {
      type: String,
      trim: true,
      default: "",
    },
    experienceLetter: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("workExperience", workExperienceSchema);
