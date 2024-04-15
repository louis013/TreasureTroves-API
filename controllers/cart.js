const Cart = require("../models/Cart");

// Add products to cart
module.exports.addProductsToCart =  async (req, res) => {

    try {
        const userId = req.user.id

        if(req.user.isAdmin == true) {
            return res.status(403).send({error: "Admin is not allowed"});
        }
        else {
            
            // Find user's cart
            let cart = await Cart.findOne({userId: userId})

            // If user's cart does not exist, create
            if(!cart) {
                cart = new Cart({userId, cartItems: [], totalPrice: 0});
            }

            // Check if the cart already contains the product id
            const productIndex = cart.cartItems.findIndex(item => item.productId === req.body.cartItems[0].productId);
            
            if (productIndex !== -1) {
                // If product already exists, update quantity and subtotal
                cart.cartItems[productIndex].quantity += req.body.cartItems[0].quantity;
                cart.cartItems[productIndex].subtotal += req.body.cartItems[0].subtotal;
            }
            else {
                // If product does not exist, add it to the cart
                cart.cartItems.push({
                productId: req.body.cartItems[0].productId,
                quantity: req.body.cartItems[0].quantity,
                subtotal: req.body.cartItems[0].subtotal
                });
            }
            console.log(cart.cartItems);

            // Update totalPrice value of the cart
            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

            // Save the cart document
            await cart.save();

            // Send response with cart contents
            res.status(201).json({ message: 'Product added to cart successfully', cart });
        }
    }
    catch(error) {
        // Catch any errors and send error details to client
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  
}