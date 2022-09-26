const User = require("../models/user");
const StatusCodes = require("http-status-codes");
const crypto = require("crypto");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  CustomAPIError,
} = require("../errors/index");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const { stat } = require("fs");
const user = require("../models/user");

// Register User

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const { role } = req.body || "user";
  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: {
      public_id: "sample avatar id",
      url: "sample url",
    },
  });

  sendToken(user, StatusCodes.CREATED, res);
};

// Login user

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password"); // since in model we marked password to be selected as false, so we need to explicitly select the password
  if (!user) {
    // if user is not fetched means, email was wrong
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  sendToken(user, StatusCodes.OK, res);
};

const Logout = async (req, res, next) => {
  res.cookie("token", null, {
    // removing the jwt token from cookies
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Logged Out",
  });
};

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new NotFoundError("User Not Found");
  }

  // get reset password token

  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false }); // saving the user

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Reset Your password by clicking on following link: -\n\n\n ${resetPasswordUrl}\n\n If you have not requested this email then please ignore it `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message: message,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // if any error occured while sending email then we must set resetToken to undefined
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false }); // saving the user

    throw new CustomAPIError(error.message);
  }
};

const resetPassword = async (req, res, next) => {
  // hashing so that we can match this with the one stored in user model
  const tokenCrypto = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    tokenCrypto,
    resetPasswordExpire: { $gt: Date.now() }, // checking if resetToken is not expired
  });

  if (!user) {
    throw new BadRequestError(
      "Reset Password Token is invalid or has been expired"
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    throw new BadRequestError("Password does not matched");
  }

  user.password = req.body.password; // we dont need to explicitly hash it again and then save it, our user model has a function that does the same for us, userSchema.pre

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // sending token means loggin in
  sendToken(user, StatusCodes.OK, res);
};

// get user details
const getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

// update password
const updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatch) {
    throw new UnauthenticatedError("Old Password is incorrect");
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    throw new BadRequestError("Password does not matched");
  }

  user.password = req.body.newPassword;

  await user.save();

  // sending token for loggin in the user
  sendToken(user, StatusCodes.OK, res);
};

const updateProfile = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(StatusCodes.OK).json({
    success: true,
  });
};

// Admin route
const getAllUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(StatusCodes.OK).json({
    success: true,
    userCount: users.length,
    users,
  });
};

// Get single User (admin route)
const getSingleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new NotFoundError(`User with id: ${req.params.id} does not exist `);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

// admin route
const updateRole = async (req, res, next) => {
  const newUserData = {
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(StatusCodes.OK).json({
    success: true,
  });
};

// admin route
const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new NotFoundError(`User with id: ${req.params.id} does not exist `);
  }

  await user.remove();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "User deleted successfully!",
  });
};

module.exports = {
  registerUser,
  loginUser,
  Logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateRole,
  deleteUser,
};
