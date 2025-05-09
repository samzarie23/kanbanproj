const userModel = require("../models/userModel.js");

// Add a user
const addUser = async (username, email, password, role, department) => {
    try {
        const user = await userModel.addUser(username, email, password, role, department);
        console.log("adding user results: ", user);
    } catch (error) {
        console.log("error adding user:", error);
    }
};

// get the user from the db by user Id
const fetchUserByUserId = async (userId) => {
    try {
        const user = await userModel.fetchUserByUserId(userId);
        console.log("fetching user by id results: ", user);
    } catch (error) {
        console.log("error fetching user by id:", error);
    }
}

// get the username from the db by email
const fetchUserByEmail = async (email) => {
    try {
        const user = await userModel.fetchUserByEmail(email);
        console.log("fetching user by email: ", user);
    } catch (error) {
        console.log("error fetching user by email:", error);
    }
}

// get the username from the db by email
const fetchUsernameByEmail = async (email) => {
    try {
        const user = await userModel.fetchUsernameByEmail(email);
        console.log("fetching username by email results: ", user);
    } catch (error) {
        console.log("error fetching username by email:", error);
    }
}

// Get the email that is assigned to the user
const fetchEmailByUserId = async (userId) => {
    try {
        const user = await userModel.fetchEmailByUserId(userId);
        console.log("fetching email by user results: ", user);
    } catch (error) {
        console.log("error fetching email by user:", error);
    }
}

// Get the password of the user by their email
const fetchPasswordByEmail = async (email) => {
    try {
        const user = await userModel.fetchPasswordByEmail(email);
        console.log("fethcing password by email results: ", user);
    } catch (error) {
        console.log("error fethcing password by email:", error);
    }
};

// Get the password of the user by id
const fetchPasswordByUserId = async (userId) => {
    try {
        const user = await userModel.fetchPasswordByUserId(userId);
        console.log("fetching password by id results: ", user);
    } catch (error) {
        console.log("error fetching password by id:", error);
    }
};

// Get the password of the user by id
const fetchPasswordByUsername = async (username) => {
    try {  
        const user = await userModel.fetchPasswordByUsername(username);
        console.log("fetching password by username results: ", user);
    } catch (error) {
        console.log("error fetching password by username:", error);
    }
};

// Get the userID of the user by email
const fetchUserID = async (email) => {
    try {
        const user = await userModel.fetchUserID(email);
        console.log("fetching user id by email results: ", user);
    } catch (error) {
        console.log("error fetching user id by email:", error);
    }
}
 

//update email
const updateEmail = async (userId, newEmail) => {
    try {
        const user = await userModel.updateEmail(userId, newEmail);
        console.log("updating email results: ", user);
    } catch (error) {
        console.log("error updating email:", error);
    }    
};


//update password
const updatePassword = async (userId, newPassword) => {
    try {
        const user = await userModel.updatePassword(userId, newPassword);
        console.log("updating password results: ", user);
    } catch (error) {
        console.log("error updating password:", error);
    }
};

// update the role
const updateRole = async (userId, newRole) => {
    try {
        const user = await userModel.updateRole(userId, newRole);
        console.log("updating role results: ", user);
    } catch (error) {
        console.log("error updating role:", error);
    }
};

//update department
const updateDepartment = async (userId, newDepartment) => {
    try {
        const user = await userModel.updateDepartment(userId, newDepartment);
        console.log("updating department results: ", user);
    } catch (error) {
        console.log("error updating department:", error);
    }
};

// remove a user
const deleteUser = async (userId) => {
    try {
        const user = await userModel.deleteUser(userId);
        console.log("deleting user results: ", user);
    } catch (error) {
        console.log("error deleting user:", error);
    }
};

// find a user by name
const fetchUserByName = async (username) => {
    try {
        const user = await userModel.fetchUserByName(username);
        console.log("Finding users with matching strings: ", user);
    } catch (error) {
        console.log("error finding users by name: ", error);
    }
}


// Run Tests
const runTests = async () => {
    console.log("\ntest results: \n");

    await addUser("adminAccount", "steve.martinez.149@my.csun.edu", "password123", "admin", "compsci");
    await fetchUserID("admin@gmail.com");
    await fetchPasswordByUserId(2);
    await fetchPasswordByEmail("admin@gmail.com");
    await fetchEmailByUserId(2);
    await fetchUsernameByEmail("admin@gmail.com");
    await fetchUserByEmail("admin@gmail.com");
    await fetchUserByUserId(2);
    await fetchPasswordByUsername("admin123");
    await updateEmail(2, "user@yahoo.com");
    await updatePassword(2, "newPassword");
    await updateDepartment(2, "art");
    await updateRole(2, "user");
    await deleteUser(3);
    await fetchUserByName("jordan");

    console.log("\nAll tests executed.\n");
};

runTests();