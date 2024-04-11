const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");
const {verify} = require("../auth");

// Route for user registration
router.post("/", userController.registerUser);

// Route for user login
router.post("/login", userController.loginUser);

//Route for getting all user details
router.get("/details", userController.userDetails)


//route for changing a user isAdmin status to true
router.patch("/:userId/set-as-admin", verify, userController.setAsAdmin)

// Route for update password
router.patch('/update-password', verify, userController.updatePassword);

module.exports = router;