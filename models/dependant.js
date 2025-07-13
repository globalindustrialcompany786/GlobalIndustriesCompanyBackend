const mongoose = require("mongoose");

const dependantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "please enter userId"],
      ref: "user",
    },
    relation: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    offerLetter: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("dependant", dependantSchema);
