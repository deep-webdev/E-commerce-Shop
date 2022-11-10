const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncError');


// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next)=>{
    const  {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    })
});

// Get Single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next)=>{

    const order = await Order.findById(req.params.id).populate("user", "name email");
    
    if (!order){
        return next(new ErrorHandler(`Order Not Found.`, 404));
    }

    res.status(200).json({
        success: true,
        order
    })

});

// Get Logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next)=>{

    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders
    })

});

// Get all orders ---- Admin
exports.allOrders = catchAsyncErrors(async (req, res, next)=>{
    
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
});


// Update Order Status ---- Admin
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next)=>{
    
    const order = await Order.findById(req.params.id);

    if (!order){
        return next(new ErrorHandler(`Order Not Found.`, 404));
    };

    if (order.orderStatus === "Delivered"){
        return next(new ErrorHandler("We have Delivered this Product", 400));
    }

    order.orderItems.forEach(async(item)=>{
        await updateStock(item.product, item.quantity)}
    );

    order.orderStatus = req.body.status;

    if (req.body.status === 'Delivered'){
        order.deliveredAt = Date.now();    
    }
    
    await order.save({ validateBeforeSave: false});
    res.status(200).json({
        success: true,
    })
});

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;
    await product.save({ validateBeforeSave: false});
}


// Delete order ---- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next)=>{
    
    const order = await Order.findById(req.params.id);

    if (!order){
        return next(new ErrorHandler(`Order Not Found.`, 404));
    }

    await order.remove();

    res.status(200).json({
        success: true
    })
});
