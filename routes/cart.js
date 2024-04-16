const express = require("express");

const router = express.Router();
const cartController = require("../controllers/cart");
const {verify, verifyAdmin} = require("../auth");

router.get('/get-cart', verify, cartController.getProductsCart)

// Route for adding products to cart
router.post('/add-to-cart', verify, cartController.addProductsToCart);

router.patch('/update-cart-quantity', verify, cartController.updateCartQuantity)

// Route for deleting item from cart
router.patch('/:productId/remove-from-cart', verify, cartController.removeItemFromCart);

// Route for clearing cart items
router.put('/clear-cart', verify, cartController.clearCart);

module.exports = router;