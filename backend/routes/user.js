const express = require("express");
const {
  registerUser,
  loginUser,
  Logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getSingleUser,
  getAllUsers,
  updateRole,
  deleteUser,
} = require("../controllers/user");

const { isLoggedIn, authorizeRole } = require("../middleware/authenticate");

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
router.route("/password/update").post(isLoggedIn, updatePassword);

// GET--> /api/v1/user/me
router.route("/user/me").get(isLoggedIn, getUserDetails);

// PATCH --> /api/v1/user/me/update
router.route("/user/me/update").patch(isLoggedIn, updateProfile);

// --------------------------------------------------------------------ADMIN Routes--------------------------------------

// GET --> /api/v1/admin/users
router
  .route("/admin/users")
  .get(isLoggedIn, authorizeRole("admin"), getAllUsers);

// GET --> /api/v1/admin/user/:id
// PATCH --> /api/v1/admin/user/:id
// DELETE --> /api/v1/admin/user/:id
router
  .route("/admin/user/:id")
  .get(isLoggedIn, authorizeRole("admin"), getSingleUser)
  .patch(isLoggedIn, authorizeRole("admin"), updateRole)
  .delete(isLoggedIn, authorizeRole("admin"), deleteUser);

module.exports = router;
