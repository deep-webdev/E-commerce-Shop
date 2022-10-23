const { ConnectionStates } = require('mongoose');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');

// Create Product
exports.createProduct = catchAsyncError(async(req, res, next)=>{
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
});

// Get all Products
exports.getAllProducts = catchAsyncError(async (req, res) =>{

    const resultPerPage = 5;
    // Product count for display total product count on frontend
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter().pagination(resultPerPage);
    // const apiFeatureFilter = new ApiFeatures(Product.find(), req.query).filter();
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount
    });
});

// Update Product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product){
        return next(new ErrorHandler("Product Not Found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        product
    })
});

// Delete Product
exports.deleteProduct = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.params.id);
    if (!product){
        return next(new ErrorHandler("Product Not Found", 404))
    }
    await product.remove(); // or we can use product.deleteOne()
    res.status(200).json({
        success: true,
        message: "Successfully Deleted the Product..."
    })
    
});

// Get single Product by ID
exports.getSingleProduct = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.params.id);
    if (!product){
        return next(new ErrorHandler("Product Not Found", 404))
    }
    res.status(200).json({
        success:true,
        product
    })

});