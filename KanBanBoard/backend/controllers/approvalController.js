const { fetchTaskById, updateTaskStatus, fetchUserAssignedToTask } = require('../models/taskModel.js');
const { fetchUserByUserId } = require('../models/userModel.js');
const { sendNotificationEmail, createTaskProgressUpdateEmail } = require('./2faEmail.js');
const { createNotification } = require('../models/notificationModel.js');

/**
 * Updates the status of a task and notifies the task creator via email and notification.
 * Prevents non-admin users from setting the status to "approved".
 *
 * @param {import('express').Request} req - The request object, expected to include `taskId` and `newStatus` in the body and the `user` in req.user.
 * @param {import('express').Response} res - The response object used to send back HTTP responses.
 */
exports.updateTask = async (req, res) => {
    try {
        const taskId = req.body.taskId;
        const newStatus = req.body.newStatus;
        const updatedTask = await updateTaskStatus(taskId, newStatus);

        // prevent non-admin users from setting the status to 'approved'
        if(newStatus.toLowerCase() === 'approved' && req.user.role.toLowerCase() !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: You cannot approve tasks.' });
        }

        // send notification email
        const task = await fetchTaskById(taskId);
        const admin = await fetchUserByUserId(task.created_by);
        const user = await fetchUserByUserId(req.user.id);
        sendNotificationEmail(admin.email, `Task Alert: ${task.title} status has changed`, createTaskProgressUpdateEmail(admin.username, task, user.username));
        await createNotification(task.created_by, 'Task Update', `Task "${task.title}" status is now "${newStatus}"`);

        res.status(200).json({ message: 'Task status updated successfully', task: task });
    } catch (err) {
        console.log("error updating task: ", err);
        res.status(500).json({ message: 'Error updating task status' });
    }
};

/**
 * Allows an admin to approve a task.
 * Sends a notification to the assigned user after approval.
 *
 * @param {import('express').Request} req - The request object, expected to include `taskId` in the body and the authenticated admin in req.user.
 * @param {import('express').Response} res - The response object used to send back HTTP responses.
 */
exports.approveTask = async (req, res) => {
    try {
        // make sure the user has admin privileges before proceeding.
        if (!req.user || req.user.role.toLowerCase() !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admin users can approve tasks.' });
        }

        const taskId = req.body.taskId;
        const approvedTask = await updateTaskStatus(taskId, "Approved");
        const task = await fetchTaskById(taskId);
        const taskAssigned = await fetchUserAssignedToTask(taskId);
        await createNotification(taskAssigned[0].user_id, 'Task Update', `Task "${task.title}" status is now "${task.status}"`);

        res.status(200).json({ message: 'Task approved' });
    } catch (err) {
        console.log("error approving task: ", err);
        res.status(500).json({ message: 'Error approving task' });
    }
};