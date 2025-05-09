/**
 * Comments routes.
 * 
 * Handles getting, updating, and adding comments.
 * These routes connect to the corresponding controller methods in `commentsController.js`.
 */

const express = require("express");
const router = express.Router();
const { authenticateJWT } = require('../middleware/authenticateJWT.js');
const { getTaskComments, getRecentComment, updateComment, removeComment, addCommentToTask } = require('../controllers/commentsController.js');

router.get("/get-task-comments", authenticateJWT, getTaskComments);
router.get("/get-most-recent-comment", authenticateJWT, getRecentComment);
router.post("/add-comment", authenticateJWT,addCommentToTask);
router.patch("/update-comment", authenticateJWT,updateComment);
router.delete("/remove-comment", authenticateJWT,removeComment);

// export the router
module.exports = router;