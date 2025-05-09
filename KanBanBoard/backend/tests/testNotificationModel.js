const notificationModel = require("../models/notificationModel.js");

const testCreateNotification = async (userId, type, message) => {
    try {
           const notification = await notificationModel.createNotification(userId, type, message);
           console.log("creating notification result: ", notification);
       } catch (err) {
           console.log("creating notification error: ", err);
    }
};

const testFetchNotificationsByUser = async (userId) => {
    try {
        const notifications = await notificationModel.fetchNotificationsByUser(userId);
        console.log("fetching notifications result: ", notifications);
    } catch (err) {
        console.log("fetching notifications error: ", err);
    }
};

const testMarkNotificationAsRead = async (notificationId) => {
    try {
        const notificationAffected = await notificationModel.markNotificationAsRead(notificationId);
        console.log("marking notification as read result: ", notificationAffected);
    } catch (err) {
        console.log("marking notification as read error: ", err);
    }
};

const runTests = async () => {
    console.log("\ntest results: \n");

    await testCreateNotification(8, "Update made on Task: create notification db", "Task has been moved to in progress stage");
    await testCreateNotification(8, "Update made on Task: create notification db", "Task has been moved to awaiting approval stage");
    await testFetchNotificationsByUser(8);
    await testMarkNotificationAsRead(1);

    console.log("\nAll tests executed.\n");
};

runTests();