/**
 * Task routes.
 * 
 * Handles fetching tasks, creating them, and deleting them.
 * There are routes that also handle the approval process. 
 * These routes connect to the corresponding controller methods in `tasksController.js`.
 */

const express = require("express");
const router = express.Router();
const {getUserTasks, makeTask, getAdminTasks, deleteTask, updateTaskStatus } = require("../controllers/taskController.js");
const {updateTask, approveTask} = require('../controllers/approvalController.js');
const { authenticateJWT } = require('../middleware/authenticateJWT');

// set up get request route for task controllers
router.get("/tasks", authenticateJWT, getUserTasks);
router.post("/create-task", authenticateJWT, makeTask);
router.get("/admin-tasks", authenticateJWT, getAdminTasks);
router.delete("/delete-task", authenticateJWT, deleteTask);
router.patch("/update-task-status", authenticateJWT, updateTask);
router.patch("/approve-task", authenticateJWT, approveTask);

// export the router
module.exports = router;