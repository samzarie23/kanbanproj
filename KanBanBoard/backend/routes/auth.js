/**
 * Authentication routes.
 * 
 * Handles login and 2FA code verification.
 * These routes connect to the corresponding controller methods in `authController.js`.
 */

const express = require("express");
const router = express.Router();
const {login, verifyCode} = require("../controllers/authController.js");

// set up post requests for the enpoints login
// call the correspoding function from the controller classs
router.post("/login", login);
router.post("/verify-code", verifyCode);

// export the router
module.exports = router;