const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Invalid Gender type");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      default:
        "https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1.jpg",
    },
    about: {
      type: String,
      default: "I am a DevTinder user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
