/**
 * Files routes.
 * 
 * Handles uploading and downloading files.
 * These routes connect to the corresponding controller methods in `filesController.js`.
 */

const express = require("express");
const router = express.Router();
const {uploadMiddleware, uploadDocument, downloadDocument, getDocumentIdForTask} = require("../controllers/filesController.js");
const { authenticateJWT } = require('../middleware/authenticateJWT.js');

// set up post requests for the files enpoints 
// call the correspoding function from the controller classs
router.post("/upload-document", authenticateJWT, uploadMiddleware, uploadDocument);
router.get("/download-document", authenticateJWT, downloadDocument);
router.get("/get-doc-id", authenticateJWT, getDocumentIdForTask);

// export the router
module.exports = router;