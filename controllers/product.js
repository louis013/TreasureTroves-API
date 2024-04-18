const Product = require("../models/Product");

// Create Product (ADMIN)
module.exports.createProduct = (req, res) => {

    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });

    Product.findOne({name: req.body.name})
    .then(existingProduct => {
        if(existingProduct) {
            return res.status(409).send({error: "Product already exists"})
        }

        return newProduct.save()
        .then((product) => res.status(201).send({message: "Product added successfully"}))
        .catch(err => {
            console.error("Error in adding product: ", err);
            res.status(500).send({error: "Error in adding product"})
        })
    })
    .catch(findErr => {
        console.error("Error in finding the product: ", findErr)
        return res.status(500).send({error: "Error in finding the product"})
    })  
};

// Retrieve all Products (Admin)
module.exports.retrieveAllProducts = async (req,res) => {
    try {
        const product = await Product.find({})
        res.status(200).send({product})
    } catch (error) {
        res.status(404).send({error: 'Items not Found'})
    }
}

// Retrieve all active Products
module.exports.retrieveAllActiveProducts = async (req,res) => {
    const activeProducts = await Product.find({isActive: true})
    res.status(200).send({activeProducts})
}

// Retrieve single product
module.exports.retrieveSingleProduct = async (req,res) => {
    try {
        const { productid } = req.params
        const product = await Product.findOne({_id: productid})
        res.status(200).send({product})
    } catch (error) {
        res.status(404).send({error: "Item not found"})
    }
}

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

    return Product.findByIdAndUpdate(req.params.productId, archive)
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

    return Product.findByIdAndUpdate(req.params.productId, activate)
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

module.exports.searchByName = async (req,res) => {
    try {
        const {name} = req.body
        const searchedProduct = await Product.find({name: { $regex: name, $options: 'i' }})
        res.status(200).send({searchedProduct})
    } catch (error) {
        res.status(404).send({error: "Product not Found"})
    }

}

module.exports.searchByPrice = async (req, res) => {
    try {
        const {minPrice, maxPrice} = req.body
        const productSearchedByPrice = await Product.find({ price: { $lte: maxPrice, $gte: minPrice } })
        res.status(200).send({productSearchedByPrice})
    } catch (error) {
        res.status(404).send({error: "Product not Found"})
    }
}