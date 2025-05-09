const { fetchTaskByUser, createTask, assignTask, fetchTaskByAdmin, deleteTask, updateTaskStatus } = require('../models/taskModel.js');
const { fetchUserByUserId } = require('../models/userModel.js');
const { sendNotificationEmail, createTaskAssignedEmail } = require('./2faEmail.js');
const { createNotification } = require('../models/notificationModel.js');

/**
 * Retrieves tasks assigned to the currently authenticated user.
 * @param {Object} req - Express request object, containing user info in req.user.
 * @param {Object} res - Express response object used to return task data or error.
 */
exports.getUserTasks = async (req, res) => {
  try {
    // get user id from the JWS token
    const userId = req.user.id; 
    // call the db to get the tasks for the user
    const tasks = await fetchTaskByUser(userId);
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

/**
 * Creates a new task and assigns it to specified users.
 * Also sends email notifications and creates in-app notifications for assigned users.
 * @param {Object} req - Express request object containing task details and assigned user IDs.
 * @param {Object} res - Express response object indicating success or failure.
 * @property {string} req.body.title - Title of the task.
 * @property {string} req.body.description - Description of the task.
 * @property {string} req.body.status - Initial status of the task (e.g., 'To Do').
 * @property {string} req.body.due_date - Due date of the task.
 * @property {Array<number>} req.body.assignedUsers - Array of user IDs to assign the task to.
 */
exports.makeTask = async (req, res) => {
  try {
    // create the task
    const task = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      due_date: req.body.due_date,
      created_by: req.user.id,
    }
    const createdTask = await createTask(task);
    
    //get admin information
    const tempAdmin = await fetchUserByUserId(req.user.id);
    const admin = {
      name: tempAdmin.username,
      email: tempAdmin.email,
    };

    // assign the task
    const assignedUsers = req.body.assignedUsers;
    for(let i = 0; i < assignedUsers.length; i++) {
      let task_assigned = await assignTask(createdTask, assignedUsers[i]);
      let user = await fetchUserByUserId(assignedUsers[i]);
      sendNotificationEmail(user.email, `Task Alert: ${task.title} has been assigned to you`, createTaskAssignedEmail(user.username, task, admin));
      await createNotification(user.user_id, 'Task Creation', `Task "${task.title}" has been created and assigned to you.`);
    }

    res.status(201).json({ message: 'Task created and assigned successfully', task: createdTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error making task '});
  }
};

/**
 * Retrieves tasks created by the currently authenticated admin user.
 * @param {Object} req - Express request object containing admin user info.
 * @param {Object} res - Express response object used to return the list of tasks.
 */
exports.getAdminTasks = async (req, res) => {
  try {
    // get admin id from the JWS token
    const userId = req.user.id; 
    // call the db to get the tasks for the admin
    const tasks = await fetchTaskByAdmin(userId);
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tasks for admin' });
  }
};

/**
 * Deletes a task from the database.
 * @param {Object} req - Express request object containing the task ID in the body.
 * @param {Object} res - Express response object confirming deletion or reporting an error.
 * @property {number} req.body.taskId - ID of the task to be deleted.
 */
exports.deleteTask = async (req, res) => {
  try {
    //get task id from request
    const taskId = req.body.taskId;
    await deleteTask(taskId);
    res.status(200).json({ message: 'Task deleted successfully'});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'deleting task error' });
  }
};

/**
 * Updates the status of an existing task.
 * @param {Object} req - Express request object containing task ID and new status.
 * @param {Object} res - Express response object confirming the update or reporting an error.
 * @property {number} req.body.taskId - ID of the task to be updated.
 * @property {string} req.body.status - New status of the task.
 */
exports.updateTaskStatus = async (req, res) => {
  try {
    //get task id and new status from request
    const taskId = req.body.taskId;
    const taskStatus = req.body.status;
    await updateTaskStatus(taskId, taskStatus);
    res.status(200).json({ message: 'Task status updated' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'updating task error' });
  }
};

