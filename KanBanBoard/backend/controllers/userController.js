const { fetchUserByName, fetchAllUsers } = require("../models/userModel.js");

/**
 * Searches for users by name or returns all users if no query is provided.
 *
 * - If a `name` query parameter is present, it fetches users whose names match the term.
 * - If no `name` is provided, it returns all users in the system.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.query.name - Optional name string to search users by.
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} JSON object with a `users` array or an error message.
 */
exports.searchUser = async (req, res) => {
  try {
    const name = req.query.name?.trim();  // Only look for the name query if it's passed

    if (name) {
      // If there is a search term, find users by name
      const users = await fetchUserByName(name);
      return res.json({ users });
    }

    // If no name query is provided, fetch all users
    const users = await fetchAllUsers();
    res.json({ users });

  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};