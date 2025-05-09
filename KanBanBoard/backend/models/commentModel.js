/**
 * Comment Model for interacting with the SQL Server database.
 * Handles operations like adding, retrieving, updating, and deleting comments on tasks.
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
 * Initializes the database connection pool.
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
 * Gets the active database connection pool.
 * Ensures the pool is initialized before returning.
 * 
 * @returns {Promise<sql.ConnectionPool>} A connection pool instance.
 */
const getPool = async () => {
    if (!pool) await initializePool();
    return pool;
};

// Call function to start the pool
initializePool();

/**
 * Adds a new comment to a task.
 * 
 * @param {number} taskId - The ID of the task to comment on.
 * @param {number} userId - The ID of the user adding the comment.
 * @param {string} content - The comment text.
 * @returns {Promise<number>} The ID of the inserted comment.
 */
const addComment = async (taskId, userId, content) => {
    try {
        const db = await getPool();
        const result = await db.request()
        .input("taskId", sql.Int, taskId)
        .input("userId", sql.Int, userId)
        .input("content", sql.NVarChar, content)
        .query(`INSERT INTO comments (task_id, user_id, content)
            OUTPUT INSERTED.comment_id
            VALUES (@taskId, @userId, @content)`);
        return result.recordset[0].comment_id;
    } catch (err) {
        console.error("Adding comment error", err);
        throw err;
    }
};

/**
 * Retrieves all comments for a specific task, ordered by creation time (newest first).
 * 
 * @param {number} taskId - The ID of the task.
 * @returns {Promise<sql.IResult<any>>} The result set containing comments.
 */
const getCommentByTask = async (taskId) => {
    try {
        const db = await getPool();
        const result = await db.request()
        .input("taskId", sql.Int, taskId)
        .query("SELECT * FROM comments WHERE task_id = @taskId ORDER BY created_at DESC");
        return result;
    } catch (err) {
        console.error("Getting comments error: ", err);
        throw err;
    }
};

/**
 * Retrieves all comments made by a specific user.
 * 
 * @param {number} userId - The ID of the user.
 * @returns {Promise<sql.IResult<any>>} The result set containing comments.
 */
const getCommentByUser = async (userId) => {
    try {
        const db = await getPool();
        const result = await db.request()
        .input("userId", sql.Int, userId)
        .query("SELECT * FROM comments WHERE user_id = @userId");
        return result;
    } catch (err) {
        console.error("Getting comments error: ", err);
        throw err;
    }
};

/**
 * Updates the content of an existing comment.
 * 
 * @param {number} commentId - The ID of the comment to update.
 * @param {string} content - The new content of the comment.
 * @returns {Promise<number>} Number of rows affected.
 */
const updateComment = async (commentId, content) => {
    try {
        const db = await getPool();
        const result = await db.request()
        .input("commentId", sql.Int, commentId)
        .input("content", sql.NVarChar, content)
        .query(`
            UPDATE comments
            SET content = @content, created_at = GETDATE()
            WHERE comment_id = @commentId
        `);
        return result.rowsAffected[0];
    } catch (error) {
        console.error("Update comment error: ", error);
        throw error;
    }
};

/**
 * Deletes a comment by its ID.
 * 
 * @param {number} commentId - The ID of the comment to delete.
 * @returns {Promise<number>} Number of rows affected.
 */
const deleteComment = async (commentId) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input('commentId', sql.Int, commentId)
            .query("DELETE FROM comments WHERE comment_id = @commentId");
        return result.rowsAffected[0];
    } catch (err) {
        console.error("Error deleting comment:", err);
        throw err;
    }
};

module.exports = {
    addComment,
    getCommentByTask,
    getCommentByUser,
    updateComment,
    deleteComment
}
