const Product = require("../models/Product");

// Create Product (ADMIN)
module.exports.createProduct = (req, res) => {

    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    })
    
    return newProduct.save()
    .then((product) => res.status(201).send({message: "Product added successfully"}))
    .catch(err => {
        console.error("Error in adding product: ", err);
        res.status(500).send({error: "Error in adding product"})
    })
};

// Update product (ADMIN)
module.exports.updateProduct = (req, res) => {

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct, {new: true})
    .then(updatedProduct => {
        if(!updatedProduct) {
            res.status(404).send({error: "Product not found"});
        }
        return res.status(200).send({
            messaage: "Product updated successfully",
            updatedProduct: updatedProduct
        })
    })
    .catch(err => {
        console.error("Error in updating product: ", err);
        res.status(500).send({error: "Error in updating product"})
    })
};

// Archive product (ADMIN)
module.exports.archiveProduct = (req, res) => {

    let archive = {
        isActive: false
    }

    return Product.findByIdAndUpdate(req.params.productId, archive, {new: true})
    .then(archivedProduct => {
        if(!archivedProduct) {
            res.status(404).send({error: "Product not found"});
        }
        res.status(200).send({
            message: "Product archived succcessfully",
            product: archivedProduct
        })
    })
    .catch(err => {
        console.log("Error in archiving product: ", err);
        res.status(500).send({error: "Error in archiving product"})
    })
};

// Activate product (ADMIN)
module.exports.activateProduct = (req, res) => {

    let activate = {
        isActive: true
    }

    return Product.findByIdAndUpdate(req.params.productId, activate, {new: true})
    .then(activatedProduct => {
        if(!activatedProduct) {
            res.status(404).send({error: "Product not found"});
        }
        res.status(200).send({
            message: "Product activated succcessfully",
            product: activatedProduct
        })
    })
    .catch(err => {
        console.log("Error in activating product: ", err);
        res.status(500).send({error: "Error in activating product"})
    })
};