const express = require("express");
const mongoose = require("mongoose");
const port = 4000;

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");

const app = express();

// MongoDB Connection
mongoose.connect("mongodb+srv://alcantarakenandaniel:wnCWEsmez5t5kZBE@b402.rmrkku1.mongodb.net/EcommerceAPI?retryWrites=true&w=majority&appName=B402");

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/users", userRoutes);
app.use("/products", productRoutes);

if(require.main === module) {
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${process.env.PORT || port}`)
    })
}

module.exports = {app, mongoose};