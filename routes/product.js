const express = require("express");

const router = express.Router();
const productController = require("../controllers/product");
const {verify, verifyAdmin} = require("../auth");

// Route for creating product (ADMIN)
router.post('/', verify, verifyAdmin, productController.createProduct);

// Route for updating product (ADMIN)
router.patch('/:productId/update', verify, verifyAdmin, productController.updateProduct);

// Route for archiving product (ADMIN)
router.patch('/:productId/archive', verify, verifyAdmin, productController.archiveProduct);

// Route for activating product (ADMIN)
router.patch('/:productId/activate', verify, verifyAdmin, productController.activateProduct);

module.exports = router;