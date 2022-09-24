const User = require("../models/user");
const StatusCodes = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  CustomAPIError,
} = require("../errors/index");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

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

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false }); // saving the user

  const resetPasswordUrl = `${req.protocol}//${req.get(
    "host"
  )}/api/v1/passwordS/forgot/${resetToken}`;

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

module.exports = { registerUser, loginUser, Logout, forgotPassword };