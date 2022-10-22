const { ConnectionStates } = require('mongoose');
const Product = require('../models/productModel');

// Create Product
exports.createProduct = async(req, res, next)=>{
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
}

// Get all Products
exports.getAllProducts = async (req, res) =>{
    const products = await Product.find()

    res.status(200).json({
        products
    });
}

// Update Product
exports.updateProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product){
        return res.status(500).json({
            success: false,
            message: "Product Not Found..."
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        product
    })
}

// Delete Product
exports.deleteProduct = async (req, res) =>{
    const product = await Product.findById(req.params.id);
    if (product){
        await product.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Successfully Deleted the Product..."
        })
    }
    res.status(500).json({
        success: false,
        message: "Product Not Found..."
    })
    
}

// Get single Product by ID
exports.getSingleProduct = async (req, res) =>{
    const product = await Product.findById(req.params.id);
    if (!product){
        return res.status(500).json({
            success: false,
            message: "Product Not Found..."
        })
    }
    res.status(200).json({
        success:true,
        product
    })

}