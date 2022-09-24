const express = require("express");
const {
  registerUser,
  loginUser,
  Logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
} = require("../controllers/user");

const { Authenticate } = require("../middleware/authenticate");

const router = express.Router();

//* CREATING API Endpoints

// POST --> /api/v1/user/register
router.route("/user/register").post(registerUser);
// POST --> /api/v1/user/login
router.route("/user/login").post(loginUser);
// GET --> /api/v1/user/logout
router.route("/user/logout").get(Logout);
// POST --> /api/v1/password/forgot
router.route("/password/forgot").post(forgotPassword);
// PATCH--> /api/v1/password/reset/:token
router.route("/password/reset/:token").patch(resetPassword);
// POST --> /api/v1/password/update
router.route("/password/update").post(Authenticate, updatePassword);

// GET--> /api/v1/user/me
router.route("/user/me").get(Authenticate, getUserDetails);

module.exports = router;
