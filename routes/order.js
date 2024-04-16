const express = require('express');

const router = express.Router();
const orderController = require('../controllers/order');
const {verify, verifyAdmin} = require("../auth");

// Route for creating order
router.post('/checkout', verify, orderController.createOrder);

router.get('/my-orders', verify, orderController.userOrder)

router.get('/all-orders', verify, verifyAdmin, orderController.allOrders)

module.exports = router;