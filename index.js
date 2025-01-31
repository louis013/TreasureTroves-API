const express = require("express");
const mongoose = require("mongoose");
const port = 4006;
const cors = require("cors");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const app = express();

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:admin123@b402-course-booking.e2a6mg0.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=B402-course-booking");

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use("/b6/users", userRoutes);
app.use("/b6/products", productRoutes);
app.use("/b6/cart", cartRoutes);
app.use("/b6/orders", orderRoutes);

if(require.main === module) {
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${process.env.PORT || port}`)
    })
}

module.exports = {app, mongoose};