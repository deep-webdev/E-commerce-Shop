const { ConnectionStates } = require('mongoose');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');

// Create Product
exports.createProduct = catchAsyncError(async(req, res, next)=>{

    req.body.user = req.user.id
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

// Create Product review or Update review
exports.createProductReview = catchAsyncError(async (req, res, next)=>{

    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating), 
        comment,
    };
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find((rev)=> rev.user.toString() === req.user._id.toString());
    
    if (isReviewed){
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment)
        });
    } else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let total=0;
    product.reviews.forEach(rev=>{
        total+= rev.rating;
    });
    product.ratings = total / product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
        product
    });
});

// Get all Reviews of a single Product
exports.getAllReviews = catchAsyncError(async (req, res, next)=>{

    const product = await Product.findById(req.query.id);

    if (!product){
        return next(new ErrorHandler(`Product not found`, 404));
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
});

// Delete Review 
exports.deleteReview = catchAsyncError(async (req, res, next)=>{

    const product = await Product.findById(req.query.productId);

    if (!product){
        return next(new ErrorHandler(`Product not found`, 404));
    }

    const reviews = product.reviews.filter(rev=> rev._id.toString() != req.query.id);

    let total=0;
    reviews.forEach(rev=>{
        total+= rev.rating;
    });
    const ratings = total / reviews.length;

    const numOfReviews = reviews.length; 

    await Product.findByIdAndUpdate(req.query.productId,{reviews, ratings, numOfReviews},
                                    {new:true, runValidators: true, useFindAndModify: false});

    res.status(200).json({
        success:true,
        message: "Review deleted successfully"
    })
});