const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please enter first name"],
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "please enter user email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "please enter user password"],
      select: false,
    },
    image: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("admin", adminSchema);
