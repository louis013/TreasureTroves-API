const express = require("express");

const router = express.Router();
const cartController = require("../controllers/cart");
const {verify, verifyAdmin} = require("../auth");

// Route for adding products to cart
router.post('/add-to-cart', verify, cartController.addProductsToCart);


module.exports = router;