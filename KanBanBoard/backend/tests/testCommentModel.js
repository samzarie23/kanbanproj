const commentModel = require("../models/commentModel.js");

// Add a comment
const testAddComment = async (taskId, userId, content) => {
    try {
        const commentId = await commentModel.addComment(taskId, userId, content);
        console.log("adding comment result: ", commentId);
    } catch (err) {
        console.log("adding comment error: " , err);
    }
};

// Get all comments for a task
const testGetCommentByTask = async (taskId) => {
    try {
        const comment = await commentModel.getCommentByTask(taskId);
        console.log("getting comment by task result: ", comment);
    } catch (err) {
        console.log("get comment by task error: ", err);
    }
};

// Get all comments for a user
const testGetCommentByUser = async (userId) => {
    try {
        const comment = await commentModel.getCommentByUser(userId);
        console.log("getting comment by user", comment);
    } catch (err) {
        console.log("get comment by user: ", user);
    }
};

// Updata a comment
const testUpdateComment = async (commentId, taskId, userId, content) => {
    try {
        const comment = await commentModel.updateComment(commentId, taskId, userId, content);
        console.log("updating comment result: ", comment);
    } catch (error) {
        console.log("update comment error: ", error);
    }
};

// Delete a comment
const testDeleteComment = async (commentId) => {
    try {
        const comment = await commentModel.deleteComment(commentId);
        console.log("Deleted commment result: ", comment);
    } catch (err) {
        console.log("delete comment error: ", err);
    }
};

// Run Tests
const runTests = async () => {
    console.log("\ntest results: \n");

    await testAddComment(5, 1, "content");
    await testAddComment(5, 1, "testing comments");
    await testGetCommentByTask(5);
    await testGetCommentByUser(1);
    await testUpdateComment(1, 5, 1, "new content");
    await testDeleteComment(2);

    console.log("\nAll tests executed.\n");
};

runTests();