const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Adding order
module.exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id

        if(req.user.isAdmin == true) {
            return res.status(403).json({ message: 'Admin is not allowed' });
        }

        // Find user's cart
        const cart = await Cart.findOne({userId});

        // If user does not have a cart
        if(!cart) {
            return res.status(404).json({ message: 'User does not have a cart' });
        }

        // Check if the cart is empty
        if(cart.cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty.' });
        }

        // Create a new Order document
        const newOrder = new Order({
            userId: cart.userId,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice
        })

        // Clear cart of user
        cart.cartItems = [];
        cart.totalPrice = 0;

        // Save the cart document
        await cart.save();

        // Save new order document
        await newOrder.save()

        res.status(201).json({ message: 'Order placed successfully.', order: newOrder });
    }
    catch(error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};