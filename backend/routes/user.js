const express = require("express");
const {
  registerUser,
  loginUser,
  Logout,
  forgotPassword,
} = require("../controllers/user");

const router = express.Router();

//* CREATING API Endpoints

// POST --> /api/v1/user/register
router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").get(Logout);
router.route("/password/forgot").post(forgotPassword);

module.exports = router;
