/**
 * User routes.
 * 
 * Handles searching for users in the database.
 * These routes connect to the corresponding controller methods in `userController.js`.
 */

const express = require("express");
const router = express.Router(); 
const {searchUser} = require("../controllers/userController.js");
const { authenticateJWT } = require('../middleware/authenticateJWT');

// set up get request route for user controller
router.get("/users/search", authenticateJWT, searchUser);

// export the router
module.exports = router;