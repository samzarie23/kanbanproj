/**
 * Notification routes.
 * 
 * Handles creating and fetching notifications. It will also get read and unread notifications.
 * These routes connect to the corresponding controller methods in `notificationController.js`.
 */

const express = require("express");
const router = express.Router();
const { authenticateJWT } = require('../middleware/authenticateJWT.js');
const { createNotification, fetchNotificationsByUser, markNotificationAsRead, fetchUnreadNotificationsNumByUser } = require("../controllers/notificationController.js");

router.post("/create-notification", createNotification);
router.get("/fetch-notifications", authenticateJWT, fetchNotificationsByUser);
router.patch("/read-notification", markNotificationAsRead);
router.get("/unread-notifications-num", authenticateJWT, fetchUnreadNotificationsNumByUser);

// export the router
module.exports = router;