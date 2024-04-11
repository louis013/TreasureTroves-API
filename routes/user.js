const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");
const {verify} = require("../auth");

// Route for user registration
router.post("/", userController.registerUser);

// Route for user login
router.post("/login", userController.loginUser);

module.exports = router;