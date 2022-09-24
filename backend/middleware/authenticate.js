const jwt = require("jsonwebtoken");
const { UnauthenticatedError, UnauthorizedError } = require("../errors/index");
const User = require("../models/user");

const Authenticate = async (req, res, next) => {
  const { token } = req.cookies; // accessing the token saved in cookies

  if (!token) {
    // if we ain't got no token then it means user is not logged in
    throw new UnauthenticatedError("Please Login to Access");
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET); // getting the payload data from token

  req.user = await User.findById(decodedData.id);
  next();
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      // if role of the user who sent request is not admin then we will throw error
      throw new UnauthorizedError(
        `${req.user.role} is not allowed to access this resource`
      );
    }
    next(); // else we will pass the control to next middleware
  };
};

module.exports = { Authenticate, authorizeRole };
