const express = require("express");
const { registerUser, loginUser } = require("../controllers/user");

const router = express.Router();

//* CREATING API Endpoints

// POST --> /api/v1/user/register
router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);

module.exports = router;
