const Cart = require("../models/Cart");

module.exports.getProductsCart = async (req,res) => {

    try {
        const cartUser = await Cart.findOne({userId: req.user.id})
        res.status(200).send({cartUser})
    } catch (error) {
        res.status(404).send({error: "Cannot find Cart"})
    }
    
}

module.exports.updateCartQuantity = async (req,res) => {

    try {
        const cartUser = await Cart.findOne({userId: req.user.id})
        const {cartItems} = cartUser
         cartItems.forEach(element => {
            if(element.productId == req.body.productId) {
                element.quantity = req.body.quantity
                element.subtotal = req.body.subtotal
            }
        });

        // Update totalPrice value of the cart
        cartUser.totalPrice = cartUser.cartItems.reduce((total, item) => total + item.subtotal, 0);

        await Cart.findOneAndUpdate({userId: req.user.id}, {cartItems: cartItems})
        res.status(200).send({message: "Cart quantity updated", cartUser})
    } catch (error) {
        res.status(404).send({error: "Cannot find Cart"})
    }
    
}

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
            const productIndex = cart.cartItems.findIndex(item => item.productId === req.body.productId);
            
            if (productIndex !== -1) {
                // If product already exists, update quantity and subtotal
                cart.cartItems[productIndex].quantity += req.body.quantity;
                cart.cartItems[productIndex].subtotal += req.body.subtotal;
            }
            else {
                // If product does not exist, add it to the cart
                cart.cartItems.push({
                productId: req.body.productId,
                quantity: req.body.quantity,
                subtotal: req.body.subtotal
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

// Remove item from cart
module.exports.removeItemFromCart = async (req, res) => {

    try {

        const userId = req.user.id;

        // Check if user is an admin
        if(req.user.isAdmin){
            return res.status(403).send({error: "Admin is not allowed"})
        }
        else {
            // Find user's cart
            const cart = await Cart.findOne({userId});

            // If user does not have a cart
            if(!cart) {
                return res.status(404).send({error: "User does not have a cart"});
            }

            const productId = req.params.productId;

            // Check if product exists in the cart
            const index = cart.cartItems.findIndex(item => item.productId === productId);

            if(index !== -1) {

                // Update totalPrice
                cart.totalPrice -= cart.cartItems[index].subtotal;

                // Remove product from cartItems array
                cart.cartItems.splice(index, 1);

                // Save updated cart
                await cart.save();

                // Send response with updated cart contents
                return res.json({ message: 'Product removed from cart', cart });
            }
            else {
                return res.status(404).json({ message: 'Product not found in cart' });
            }
        }
    }
    catch(error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Clear cart
module.exports.clearCart = async (req, res) => {

    try {
        const userId = req.user.id;

        // Check if user is an admin
        if(req.user.isAdmin == true) {
            return res.status(403).send({error: "Admin is not allowed"})
        }
        else {
            const cart = await Cart.findOne({ userId });

            // Check if user has a cart
            if (!cart) {
                return res.status(404).json({ message: "User does not have a cart" });
            }

            // Check if the cart is empty
            if (cart.cartItems.length === 0) {
                return res.status(400).json({ message: "Cart is already empty" });
            }

            // Clear the items in cartItems array
            cart.cartItems = [];
            // Change the totalPrice to 0
            cart.totalPrice = 0;

            await cart.save();

            return res.status(200).json({ message: "Items removed from cart successfully", cart });
        }
    }
    catch(error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};