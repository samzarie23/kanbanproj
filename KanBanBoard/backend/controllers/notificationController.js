const { createNotification, fetchNotificationsByUser, markNotificationAsRead, getUnreadCountByUser } = require("../models/notificationModel.js");
const { fetchTaskById } = require("../models/taskModel.js")

/**
 * Creates a new notification for a user based on taskId, type, and message.
 * @param {Object} req - Express request object containing taskId, type, and message in the body.
 * @param {Object} res - Express response object to send status and result.
 */
exports.createNotification = async (req, res) => {
    try {
        const { taskId, type, message,} = req.body;
        task = await fetchTaskById(taskId);
        
        // Create the notification in the database
        const notificationId = await createNotification(task.created_by, type, message);
    
        // Return success with the new notification’s ID
        res.status(201).json({ message: 'Notification created successfully', notificationId });
      } catch (err) {
        console.error('Error creating notification:', err);
        res.status(500).json({ message: 'Error creating notification' });
      }
};

/**
 * Retrieves all notifications for the currently authenticated user.
 * @param {Object} req - Express request object with user object populated by authentication middleware.
 * @param {Object} res - Express response object to return notifications.
 */
exports.fetchNotificationsByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await fetchNotificationsByUser(userId);
        res.status(200).json({ message: "Notifactions fetched successfully", notifications});
    } catch (err) {
        console.error("Error fetching notifications", err);
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

/**
 * Marks a specific notification as read.
 * @param {Object} req - Express request object with notificationId in the body.
 * @param {Object} res - Express response object to confirm update.
 */
exports.markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.body.notificationId;
        await markNotificationAsRead(notificationId);
        res.status(200).json({ message: 'Notification marked as read'});
    } catch (err) {
        console.error('Error marking notidication as read:', err);
        res.status(500).json({ message: 'Error marking notification as read' });
    }
};

/**
 * Retrieves the count of unread notifications for the authenticated user.
 * @param {Object} req - Express request object with user info from auth middleware.
 * @param {Object} res - Express response object to return unread notification count.
 */
exports.fetchUnreadNotificationsNumByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const notiNum = await getUnreadCountByUser(userId);
        res.status(200).json({ message: "Unread Notifaction number fetched successfully", notiNum});
    } catch (err) {
        console.error("Error fetching unread notifications number", err);
        res.status(500).json({ message: "Error fetching unread notifications number" });
    }
};