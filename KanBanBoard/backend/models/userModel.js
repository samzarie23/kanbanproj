/**
 * Module to manage user-related database operations for the Kanban Board system.
 * This module uses Microsoft SQL Server and bcrypt for secure password hashing.
 */

// Make the connction to the database
const sql = require('mssql');
let pool;

// Import bcrypt for hashing passwords
const bcrypt = require('bcrypt'); 

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
 * Initialize the SQL connection pool.
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
 * Retrieve the current pool or initialize if needed.
 * @returns {Promise<sql.ConnectionPool>} SQL connection pool
 */
const getPool = async () => {
    if (!pool) await initializePool();
    return pool;
};

// Call function to start the pool
initializePool();

/**
 * Create a new user in the database.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} role
 * @param {string} department
 * @returns {Promise<number>} User ID of newly created user
 */
const addUser = async (username, email, password, role, department) => {
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const db = await getPool();
      const result = await db.request()
          .input("username", sql.NVarChar, username)
          .input("email", sql.NVarChar, email)
          .input("password", sql.NVarChar, hashedPassword)
          .input("role", sql.NVarChar, role)
          .input("department", sql.NVarChar, department)
          .query(`
              INSERT INTO [user] (username, email, password, role, department)
              OUTPUT INSERTED.user_id
              VALUES (@username, @email, @password, @role, @department)
          `);
      return result.recordset[0].user_id;
  } catch (err) {
      console.error("Error creating user:", err);
      throw err;
  }
};

/**
 * Fetch user data by user ID.
 * @param {number} userId
 * @returns {Promise<Object>} User data
 */
const fetchUserByUserId = async (userId) => {
    try {
      const db = await getPool();
      const result = await db.request()
            .input("user_id", sql.Int, userId)
            .query("SELECT * FROM [user] WHERE user_id = @user_id");
        return result.recordset[0];
    } catch (err) {
        console.error("Error fetching task: ", err);
        throw err; 
    }
};

/**
 * Fetch user data by email.
 * @param {string} email
 * @returns {Promise<Object>} User data
 */
const fetchUserByEmail = async (email) => {
  try {
    const db = await getPool();
    const result = await db.request()
          .input("email", sql.NVarChar, email)
          .query("SELECT * FROM [user] WHERE email = @email");
      return result.recordset[0];
  } catch (err) {
      console.error("Error fetching task: ", err);
      throw err; 
  }
};

/**
 * Fetch only username by email.
 * @param {string} email
 * @returns {Promise<Object>} Username
 */
const fetchUsernameByEmail = async (email) => {
  try {
    const db = await getPool();
    const result = await db.request()
          .input("email", sql.NVarChar, email)
          .query("SELECT username FROM [user] WHERE email = @email");
      return result.recordset[0];
  } catch (err) {
      console.error("Error fetching task: ", err);
      throw err; 
  }
};

/**
 * Fetch email using user ID.
 * @param {number} userId
 * @returns {Promise<Object>} Email address
 */
const fetchEmailByUserId = async (userId) => {
    try {
      const db = await getPool();
      const result = await db.request()
            .input("userId", sql.Int, userId)
            .query("SELECT email FROM [user] WHERE user_id = @userId");
        return result.recordset[0];
    } catch(err) {
        console.error("Error fetching task: ", err);
        throw err; 
    }
};

/**
 * Fetch hashed password by email.
 * @param {string} email
 * @returns {Promise<Object[]>} Password row
 */
const fetchPasswordByEmail = async (email) => {
    try {
      const db = await getPool();
      const result = await db.request()
            .input("email", sql.NVarChar, email)
            .query("SELECT password FROM [user] WHERE email = @email");
        return result.recordset;
    } catch(err) {
        console.error("Error fetching task: ", err);
        throw err; 
    }
};

/**
 * Fetch hashed password by user ID.
 * @param {number} userId
 * @returns {Promise<Object[]>} Password row
 */
const fetchPasswordByUserId = async (userId) => {
  try {
    const db = await getPool();
    const result = await db.request()
          .input("userId", sql.Int, userId)
          .query("SELECT password FROM [user] WHERE user_id = @userId");
      return result.recordset;
  } catch(err) {
      console.error("Error fetching task: ", err);
      throw err; 
  }
};

/**
 * Fetch hashed password by username.
 * @param {string} username
 * @returns {Promise<Object[]>} Password row
 */
const fetchPasswordByUsername = async (username) => {
  try {
    const db = await getPool();
    const result = await db.request()
          .input("username", sql.NVarChar, username)
          .query("SELECT password FROM [user] WHERE username = @username");
      return result.recordset;
  } catch(err) {
      console.error("Error fetching task: ", err);
      throw err; 
  }
};

/**
 * Fetch user ID by email.
 * @param {string} email
 * @returns {Promise<Object[]>} User ID
 */
const fetchUserID = async (email) => {
    try {

      const db = await getPool();
      const result = await db.request()
          .input("email", sql.NVarChar, email)
          .query("SELECT user_id FROM [user] WHERE email = @email");
      return result.recordset;
    } catch(err) {
        console.error("Error fetching task: ", err);
        throw err; 
    }
};
 

/**
 * Update email of a user.
 * @param {number} userId
 * @param {string} newEmail
 * @returns {Promise<boolean>} Success status
 */
const updateEmail = async (userId, newEmail) => {
    try {
      const db = await getPool();
      const result = await db.request()
          .input("user_id", sql.Int, userId)
          .input("email", sql.NVarChar, newEmail)
          .query(`
              UPDATE [user]
              SET email = @email
              WHERE user_id = @user_id
          `);
      return result.rowsAffected[0] > 0;
    } catch (err) {
      console.log("error updating email: ", err);
    }
};


/**
 * Update password of a user.
 * @param {number} userId
 * @param {string} newPassword
 * @returns {Promise<boolean>} Success status
 */
const updatePassword = async (userId, newPassword) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const db = await getPool();
    const result = await db.request()
        .input("userId", sql.Int, userId)
        .input("hashedPassword", sql.NVarChar, hashedPassword)
        .query("UPDATE [user] SET password = @hashedPassword WHERE user_id = @userId");
    
    return result.rowsAffected[0] > 0;
  } catch (err) {
    console.log("error updating password: ", err);
  }
};

/**
 * Update role of a user.
 * @param {number} userId
 * @param {string} newRole
 * @returns {Promise<boolean>} Success status
 */
const updateRole = async (userId, newRole) => {
  /*
  const validRoles = ["admin", "user"];
  if (!validRoles.includes(newRole)) {
      console.error("Invalid role:", newRole);
      return false;
  }
  */

  try {
      const db = await getPool();
      const result = await db.request()
          .input("user_id", sql.Int, userId)
          .input("newRole", sql.NVarChar, newRole)
          .query("UPDATE [user] SET role = @newRole WHERE user_id = @user_id");

      return result.rowsAffected[0] > 0;
  } catch (err) {
      console.error("Error updating role:", err);
      throw err;
  }
};

/**
 * Update department of a user.
 * @param {number} userId
 * @param {string} newDepartment
 * @returns {Promise<boolean>} Success status
 */
const updateDepartment = async (userId, newDepartment) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input("user_id", sql.Int, userId)
            .input("department", sql.NVarChar, newDepartment)
            .query("UPDATE [user] SET department = @department WHERE user_id = @user_id");
        
          return result.rowsAffected[0] > 0;
    } catch (err) {
      console.log("error updating department: ", err);
    }
};

/**
 * Delete a user.
 * @param {number} userId
 * @returns {Promise<boolean>} Success status
 */
const deleteUser = async (userId) => {
  try {
      const db = await getPool();
      const result = await db.request()
          .input("userId", sql.Int, userId)
          .query("DELETE FROM [user] WHERE user_id = @userId");

      return result.rowsAffected[0] > 0;
  } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
  }
};

/**
 * Search users by partial name.
 * @param {string} username
 * @returns {Promise<Object[]>} Matching users
 */
const fetchUserByName = async(username) => {
    try {
        const db = await getPool();
        const result = await db.request()
            .input("username", sql.NVarChar, username)
            .query("SELECT * FROM [user] WHERE username LIKE '%' + @username + '%'");

        return result.recordset;
    } catch (err) {
        console.log("Error finding user: ", err);
        throw err;
    }
};

/**
 * Fetch all users from the database.
 * @returns {Promise<Object[]>} All users
 */
const fetchAllUsers = async () => {
    try {
      const db = await getPool();
      const result = await db.request().query("SELECT * FROM [user]");  // This fetches all users
      return result.recordset;
    } catch (err) {
      console.log("Error fetching all users: ", err);
      throw err;
    }
};


// Export all db queries for task table
module.exports = {
    addUser,
    fetchUserID,
    updateEmail,
    updatePassword,
    updateDepartment,
    updateRole,
    deleteUser,
    fetchPasswordByUserId,
    fetchPasswordByEmail,
    fetchEmailByUserId,
    fetchUsernameByEmail,
    fetchUserByEmail,
    fetchUserByUserId,
    fetchPasswordByUsername,
    fetchUserByName,
    fetchAllUsers,
};