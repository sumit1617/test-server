const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have minimum 4 characters"],
  },

  email: {
    type: String,
    required: [true, "Please enter your Mail"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid Mail"],
  },

  password: {
    type: String,
    required: [true, "Please enter your Password"],
    minLength: [8, "Password should be of minimum 8 characters"],
    select: false,
  },

  role: {
    type: String,
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
