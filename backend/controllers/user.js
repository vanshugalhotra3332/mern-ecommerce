const User = require("../models/user");
const StatusCodes = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const sendToken = require("../utils/jwtToken");

// Register User

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
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

module.exports = { registerUser, loginUser };
