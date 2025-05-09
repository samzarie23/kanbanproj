const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require("fs");

// Load JSON file
//const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
//const users = config.users;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kanbanboard491@gmail.com',
        pass: 'xahp yfgz dfxa eisz',
    },
});

/**
 * Generates a 6-digit random authentication code.
 * @returns {number} A 6-digit integer code.
 */
function generateCode() {
    return crypto.randomInt(100000,999999);
}

/**
 * Sends a 2FA authentication code to the email provided.
 * @param {string} email - The recipient's email address.
 * @param {number} Code - The 2FA code to send.
 */
function sendCodeEmail (email, Code) {
    const mailOptions = {
        from: 'kanbanboard491@gmail.com',
        to: email,
        subject : 'Authentication Code',
        text: `Your authentication code is: ${Code}`,

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('error sending code: ', error);
        } else {
            console.log('code sent: ', info.response);
        }
    });
}

/**
 * Sends a generic notification email.
 * @param {string} userEmail - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} emailContent - The body content of the email.
 */
function sendNotificationEmail (userEmail, subject, emailContent) {
    const mailOptions = {
        from: 'kanbanboard491@gmail.com',
        to: userEmail,
        subject : subject,
        text: emailContent,

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('error sending email: ', error);
        } else {
            console.log('email sent: ', info.response);
        }
    });
};

/**
 * Generates email content when a task is assigned to a user.
 * @param {string} username - The name of the user the task is assigned to.
 * @param {Object} task - The task object.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.due_date - The due date of the task.
 * @param {Object} admin - The admin user assigning the task.
 * @param {string} admin.name - The admin's name.
 * @param {string} admin.email - The admin's email.
 * @returns {string} Formatted email content.
 */
function createTaskAssignedEmail(username, task, admin) {
    return `
  Hello ${username},
  
  You have been assigned a new task in CSUN's Kanban Board.
  
  Task Details:
  -----------------------
  Title: ${task.title}
  Description: ${task.description}
  Due Date: ${task.due_date}
  Assigned By: ${admin.name} (${admin.email})
  
  Please log in to your account to view more details and update the task status as needed.
  
  `;
};

/**
 * Generates email content to notify an admin of progress updates.
 * @param {string} adminName - The name of the admin.
 * @param {Object} task - The task object.
 * @param {string} task.title - Task title.
 * @param {string} task.description - Task description.
 * @param {string} task.due_date - Task due date.
 * @param {string} updatedBy - The user who updated the task.
 * @returns {string} Formatted email content.
 */
const createTaskProgressUpdateEmail = (adminName, task, updatedBy) => {
    return `
  Hello ${adminName},
  
  The task "${task.title}" has been updated by ${updatedBy} with new progress.
  
  Task Details:
  -----------------------
  Title: ${task.title}
  Description: ${task.description}
  Due Date: ${task.due_date}
  
  Please log in to the Kanban Board application to review the update and take any necessary actions.
  
    `;
  };

  
/**
 * In-memory object to store temporary 2FA codes.
 * @type {Object.<string, number>}
 */
const tempCodes = {};

// Export the functions and tempCodes object
module.exports = { generateCode, sendCodeEmail, sendNotificationEmail, tempCodes, createTaskAssignedEmail, createTaskProgressUpdateEmail };