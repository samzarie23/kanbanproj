/**
 * Task model for interacting with SQL Server task-related operations.
 * Handles creation, retrieval, updates, and deletions of tasks and task assignments.
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
 * Returns the database connection pool, initializing it if not already done.
 * @returns {Promise<sql.ConnectionPool>} Database pool instance
 */
const getPool = async () => {
    if (!pool) await initializePool();
    return pool;
};

// Call function to start the pool
initializePool();

/**
 * Retrieves a task by its ID.
 * @param {number} taskId - The ID of the task to fetch.
 * @returns {Promise<Object>} Task object.
 */
const fetchTaskById = async (taskId) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input("taskId", sql.Int, taskId)
            .query("SELECT * FROM tasks WHERE task_id = @taskId");
        return result.recordset[0];
    } catch (err) {
        console.error("Error fetching task: ", err);
        throw err; 
    }
}

/**
 * Retrieves all tasks assigned to a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object[]>} List of task objects.
 */
const fetchTaskByUser = async (userId) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input("userId", sql.Int, userId)
            .query(`SELECT tasks.* 
                FROM task_assigned
                JOIN tasks  ON task_assigned.task_id = tasks.task_id
                WHERE task_assigned.user_id = @userId`);
        return result.recordset;
    } catch(err) {
        console.error("Error fetching task: ", err);
        throw err; 
    }
}

/**
 * Retrieves all tasks created by a specific admin.
 * @param {number} userId - The ID of the admin.
 * @returns {Promise<Object[]>} List of task objects.
 */
const fetchTaskByAdmin = async (userId) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input("createdBy", sql.Int, userId)
            .query(`SELECT 
                tasks.*, 
                u.username
                FROM tasks
                LEFT JOIN task_assigned ta ON tasks.task_id = ta.task_id
                LEFT JOIN [user] u ON ta.user_id = u.user_id
                WHERE tasks.created_by = @createdBy`);
        return result.recordset;
    } catch(err) {
        console.error("Error fetching task: ", err);
        throw err; 
    }
}

/**
 * Retrieves tasks by user ID and task status.
 * @param {number} userId - User ID.
 * @param {string} status - Task status (e.g., 'To Do', 'In Progress').
 * @returns {Promise<Object[]>} List of task objects.
 */
const fetchTaskByUserAndStatus = async (userId, status) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input("userId", sql.Int, userId)
            .input("status", sql.NVarChar(45), status)
            .query("SELECT * FROM tasks WHERE created_by = @userId AND status = @status");
        return result.recordset;
    } catch(err) {
        console.error("Error fetching task: ", err);
        throw err; 
    }
}

/**
 * Creates a new task.
 * @param {Object} task - Task object containing title, description, status, due_date, and created_by.
 * @returns {Promise<number>} The ID of the created task.
 */
const createTask = async (task) => {
    try {
        const {title, description, status, due_date, created_by} = task;
        const db = await getPool();
        const result = await db.request()
            .input('title', sql.NVarChar(45), title)
            .input('description', sql.NVarChar(sql.MAX), description)
            .input('status', sql.NVarChar(45), status)
            .input('due_date', sql.Date, due_date)
            .input('created_by', sql.Int, created_by)
            .query(`
                INSERT INTO tasks (title, description, status, due_date, created_by)
                OUTPUT INSERTED.task_id
                VALUES (@title, @description, @status, @due_date, @created_by)
            `);
        return result.recordset[0].task_id;
    } catch (err) {
        console.error("Error creating task:", err);
        throw err; 
    }
};


/**
 * Updates an existing task.
 * @param {number} taskId - The ID of the task to update.
 * @param {Object} changes - Updated task fields.
 * @returns {Promise<Object>} The updated task object.
 */
const updateTask = async (taskId, changes) => {
    try {
        const {title, description, status, due_date, created_by} = changes;
        const db = await getPool();
        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('title', sql.NVarChar(45), title)
            .input('description', sql.NVarChar(sql.MAX), description)
            .input('status', sql.NVarChar(45), status)
            .input('due_date', sql.Date, due_date)
            .input('created_by', sql.Int, created_by)
            .query(`
                UPDATE tasks
                SET title = @title, description = @description, status = @status,
                    due_date = @due_date, created_by = @created_by
                WHERE task_id = @taskId
            `);

        return await fetchTaskById(taskId);
    } catch (err) {
        console.error("Error updating task:", err);
        throw err; 
    }
};

/**
 * Deletes a task by ID.
 * @param {number} taskId - The ID of the task to delete.
 * @returns {Promise<number>} Number of rows affected.
 */
const deleteTask = async (taskId) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query("DELETE FROM tasks WHERE task_id = @taskId");
        return result.rowsAffected[0];
    } catch (err) {
        console.error("Error deleting task:", err);
        throw err; 
    }
};

/**
 * Updates the status of a task.
 * @param {number} taskId - Task ID.
 * @param {string} newStatus - New status value.
 * @returns {Promise<number>} Number of rows affected.
 */
const updateTaskStatus = async (taskId, newStatus) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('newStatus', sql.NVarChar(45), newStatus)
            .query("UPDATE tasks SET status = @newStatus WHERE task_id = @taskId");
        return result.rowsAffected[0]; 
    } catch (err) {
        console.error("Error updating task status:", err);
        throw err; 
    }
};

/**
 * Assigns a task to a user.
 * @param {number} taskId - Task ID.
 * @param {number} userId - User ID.
 * @returns {Promise<number>} Number of rows affected.
 */
const assignTask = async (taskId, userId) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .input('userId', sql.Int, userId)
            .query(`
                INSERT INTO task_assigned (task_id, user_id)
                VALUES (@taskId, @userId)
            `);
        return result.rowsAffected[0];
    } catch (err) {
        console.error("Error assigning task: ", err);
        throw err; 
    }
};

/**
 * Retrieves all users assigned to a task.
 * @param {number} taskId - Task ID.
 * @returns {Promise<Object[]>} List of user-task assignments.
 */
const fetchUserAssignedToTask = async (taskId) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input('taskId', sql.Int, taskId)
            .query("SELECT * FROM task_assigned WHERE task_id = @taskId");
        return result.recordset;
    } catch (err) {
        console.error("Error fethching user assigned to task: ", err);
        throw err;
    }
};

// Export all db queries for task table
module.exports = {
    fetchTaskById,
    fetchTaskByUser,
    fetchTaskByUserAndStatus,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    assignTask,
    fetchTaskByAdmin,
    fetchUserAssignedToTask
};