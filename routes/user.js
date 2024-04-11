const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");
const {verify} = require("../auth");

// Route for user registration
router.post("/", userController.registerUser);

// Route for user login
router.post("/login", userController.loginUser);

// Route for update password
router.patch('/update-password', verify, userController.updatePassword);

module.exports = router;