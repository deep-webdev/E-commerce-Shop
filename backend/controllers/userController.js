const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');

// Register a User
exports.registerUser = catchAsyncError(async(req, res, next)=>{
    const {name, email, password} = req.body;

    const user = await User.create({name, email, password, avatar:{
        public_id:"sample public id",
        url: "sample url"
    }})

    sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncError(async(req, res, next)=>{
    const {email, password} = req.body;

    if (!email || !password){
        return next(new ErrorHandler("Please enter Email and Password", 400));
    }
    
    const user = await User.findOne({ email }).select("+password");

    if (!user){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPassMatched = await user.comparePassword(password);

    // console.log(isPassMatched)

    if (!isPassMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
});
