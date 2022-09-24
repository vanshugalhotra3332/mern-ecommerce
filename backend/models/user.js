const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
    minLength: [8, "Password should be atleast 8 characters long"],
    select: false, // select false means whenever I access the data of the user using find method, i dont wanna recieve password in that object
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// this will be executed before saving userSchema
userSchema.pre("save", async function (next) {
  // we cannot use this in arrow function

  if (!this.isModified("password")) {
    // we want to make sure that we only encrypt password if it is modified
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
// creating our userSchema custom methods
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

userSchema.methods.getResetPasswordToken = async function () {
  // Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and adding to user schema
  const tokenCrypto = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordToken = tokenCrypto;
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // for 15 minutes

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
