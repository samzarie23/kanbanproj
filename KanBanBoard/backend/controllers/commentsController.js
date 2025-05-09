const { getCommentByTask, addComment, updateComment, deleteComment } = require('../models/commentModel.js');

/**
 * Retrieves all comments for a specific task.
 *
 * @param {import('express').Request} req - Express request object, expects `taskId` in the body.
 * @param {import('express').Response} res - Express response object.
 */
exports.getTaskComments = async (req, res) => {
    try {
        const taskId = req.query.taskId;
        const comments = await getCommentByTask(taskId);
        res.status(200).json({message: "Comments for task retrieved", comments: comments});
    } catch (err) {
        console.log("Error getting comments of the task: ", err);
        res.status(500).json({ message: 'Error getting comments of the task' });
    }
};

/**
 * Retrieves the most recent comment for a task.
 *
 * @param {import('express').Request} req - Express request object, expects `taskId` in the body.
 * @param {import('express').Response} res - Express response object.
 */
exports.getRecentComment = async (req, res) => {
    try {
        const taskId = req.body.taskId;
        const comments = await getCommentByTask(taskId);
        res.status(200).json({message: "Most recent comment for task retrieved", comment: comments.recordset[0]});
    } catch (err) {
        console.log("Error getting most recent comment of the task: ", err);
        res.status(500).json({ message: 'Error getting most recent comment of the task' });
    }
};

/**
 * Adds a new comment to a task by the authenticated user.
 *
 * @param {import('express').Request} req - Express request object, expects `taskId` and `content` in the body.
 * @param {import('express').Response} res - Express response object.
 */
exports.addCommentToTask = async (req, res) => {
    try {
        const taskId = req.body.taskId;
        const content = req.body.content;
        const userId = req.user.id;

        const comment = await addComment(taskId, userId, content);
        res.status(201).json({message: "comment added to database", comment: comment});
    } catch (err) {
        console.log("Error adding comment to task", err);
        res.status(500).json({message: "Error adding comment to task"});
    }
};

/**
 * Updates an existing comment's content.
 *
 * @param {import('express').Request} req - Express request object, expects `commentId` and `content` in the body.
 * @param {import('express').Response} res - Express response object.
 */
exports.updateComment = async (req, res) => {
    try {
        const commentId = req.body.commentId;
        const newContent = req.body.content;

        await updateComment(commentId, newContent);
        res.status(201).json({message: "comment updated"});
    } catch (err) {
        console.log("Error updating comment", err);
        res.status(500).json({message: "Error updating comment for task"});
    }
};

/**
 * Deletes a comment by its ID.
 *
 * @param {import('express').Request} req - Express request object, expects `commentId` in the body.
 * @param {import('express').Response} res - Express response object.
 */
exports.removeComment = async (req, res) => {
    try {
        const commentId = req.body.commentId;
        await deleteComment(commentId);
        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (err) {
        console.log("Error deleting comment", err);
        res.status(500).json({message: "Error deleting comment"});
    }
};