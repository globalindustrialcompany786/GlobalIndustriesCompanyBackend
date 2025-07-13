const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
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
    employeeId: {
      type: String,
      required: [true, "please enter employeeId"],
      unique: true,
      trim: true,
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
    department: {
      type: String,
      default: "",
    },
    dateOfHire: {
      type: String,
      default: "",
    },
    employeeStatus: {
      type: String,
      default: "",
    },
    employeeType: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    sourceOfHire: {
      type: String,
      default: "",
    },
    workPhone: {
      type: String,
      default: "",
    },
    salary: {
      type: String,
      default: "",
    },
    payType: {
      type: String,
      default: "",
    },
    passportNumber: {
      type: String,
      default: "",
    },
    personalDetails: {
      address1: {
        type: String,
        default: "",
      },
      address2: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
      mobile: {
        type: String,
        default: "",
      },
      otherEmail: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        trim: true,
        enum: ["Male", "Female", "Other"],
        default: "Male",
      },
      maritalStatus: {
        type: String,
        default: "",
      },
      dateOfBirth: {
        type: String,
        default: "",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("user", userSchema);
