const mongoose = require("mongoose");

const educationSchema = mongoose.Schema(
  {
    schoolName: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "please enter userId"],
      ref: "user",
    },
    degree: {
      type: String,
      default: "",
    },
    fieldOfStudy: {
      type: String,
      default: "",
    },
    yearOfCompletion: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      trim: "",
      default: "",
    },
    interests: {
      type: String,
      default: "",
    },
    document: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("education", educationSchema);
