/**
 * Notification Model
 * Manages all database interactions related to notifications.
 */

// Make the connction to the database
const sql = require('mssql');
let pool;

// Config for db connection
const config = {
    user: 'szadmin',
    password: 'password123!',
    server: 'kanbanboardsz.database.windows.net',
    database: 'kanban_board',
    options: {
        encrypt: true,
        trustServerCertificate: true 
    }
};

/**
 * Initializes the SQL Server connection pool if not already created.
 */
const initializePool = async () => {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log("Connected to SQL Server");
        } catch (err) {
            console.error("Database connection failed: ", err);
            throw err; 
        }
    }
};

/**
 * Ensures the database connection pool is ready.
 * @returns {Promise<sql.ConnectionPool>} Active DB connection pool
 */
const getPool = async () => {
    if (!pool) await initializePool();
    return pool;
};

// call function to start the pool
initializePool();

/**
 * Creates a new notification for a user.
 * @param {number} userId - The ID of the user to notify.
 * @param {string} type - The type/category of notification.
 * @param {string} message - The content/message of the notification.
 * @returns {Promise<number>} The inserted notification's ID.
 */
const createNotification = async (userId, type, message) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input('userId', sql.Int, userId)
            .input('type', sql.NVarChar(50), type)
            .input('message', sql.NVarChar(255), message)
            .query(`
                INSERT INTO notifications (user_id, type, message)
                OUTPUT INSERTED.notification_id
                VALUES (@userId, @type, @message)
            `);
        // return the inserted notification's id
        return result.recordset[0].notification_id;
    } catch (err) {
        console.error("Error creating notification:", err);
        throw err;
    }
};

/**
 * Retrieves all notifications for a given user, sorted by newest first.
 * @param {number} userId - The ID of the user whose notifications are being fetched.
 * @returns {Promise<Array>} Array of notification objects.
 */
const fetchNotificationsByUser = async (userId) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT * FROM notifications
                WHERE user_id = @userId
                ORDER BY created_at DESC
            `);
        return result.recordset;
    } catch (err) {
        console.error("Error fetching notifications for user:", err);
        throw err;
    }
};

/**
 * Marks a specific notification as read.
 * @param {number} notificationId - The ID of the notification to update.
 * @returns {Promise<number>} Number of rows affected.
 */
const markNotificationAsRead = async (notificationId) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input('notificationId', sql.Int, notificationId)
            .query(`
                UPDATE notifications
                SET is_read = 1
                WHERE notification_id = @notificationId
            `);
        // returns the number of rows affected
        return result.rowsAffected[0];
    } catch (err) {
        console.error("Error marking notification as read:", err);
        throw err;
    }
};


/**
 * Retrieves the count of unread notifications for a user.
 * @param {number} userId - The ID of the user to check.
 * @returns {Promise<number>} Count of unread notifications.
 */
const getUnreadCountByUser = async (userId) => {
    try {
      const db = await getPool();
      const result = await db.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT COUNT(*) AS unreadCount
          FROM notifications
          WHERE user_id = @userId
            AND is_read = 0
        `);
      return result.recordset[0].unreadCount;
    } catch (err) {
      console.error('Error fetching unread notification count:', err);
      throw err;
    }
};

module.exports = {
    createNotification,
    fetchNotificationsByUser,
    markNotificationAsRead,
    getUnreadCountByUser
};
