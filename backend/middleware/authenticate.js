const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");
const User = require("../models/user");

const Authenticate = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    // if we ain't got no token then it means user is not logged in
    throw new UnauthenticatedError("Please Login to Access");
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET); // getting the payload data from token

  req.user = await User.findById(decodedData.id);
  next();
};

module.exports = Authenticate;
