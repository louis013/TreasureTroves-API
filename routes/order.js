const express = require('express');

const router = express.Router();
const orderController = require('../controllers/order');
const {verify, verifyAdmin} = require("../auth");

// Route for creating order
router.post('/checkout', verify, orderController.createOrder);


module.exports = router;