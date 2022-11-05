const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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


// Logout User
exports.logoutUser = catchAsyncError(async(req, res, next)=>{

    res.cookie("token", null, {'expires': new Date(Date.now()), 'httpOnly': true})
    res.status(200).json({
        success:true,
        message:"Logged out Successfully."
    })
});

// Forgot Password 
exports.forgotPassword = catchAsyncError(async (req, res, next)=>{

    const user = await User.findOne({'email': req.body.email})
    if (! user){
        return next(new ErrorHandler("User not Found", 404));
    }
    // Get Reset Password Token
    console.log(user.name);
    const resetToken = await user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetLink = `${req.protocol}://${req.get("host")}/api/v1/reset/password/${resetToken}`;

    const message = `Your Password Reset token is: \n\n ${resetLink} \n\n If you have not requested this email then
    please ingore it.`

    try{
        console.log("IN Try.....>>>>>")
        await sendEmail({
            email:user.email,
            subject: `E-commerce Password Recovery`,
            message,
        })
    } catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
        next(new ErrorHandler(error.message, 500))
    }
})

// Reset Password Generation
exports.resetPassword = catchAsyncError(async(req, res, next)=>{

    // Creating token hash
    const token = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        token,
        resetPasswordExpire: { $gt:Date.now() }
    });

    if (user) {
        return next(new ErrorHandler("Reset Password token is invalid or has been expired", 404));
    }
    if (req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler("Password Doesn't match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save();

    sendToken(user, 200, res);
})

// Get user details
exports.getUserDeatils = catchAsyncError(async (req, res, next) =>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user   
    });
});

// Update Password
exports.updatePassword = catchAsyncError(async (req, res, next) =>{

    const user = await User.findById(req.user.id).select("+password");

    const isPassMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPassMatched){
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword != req.body.confirmPassword){
        return next(new ErrorHandler("Password Doesn't match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    
    sendToken(user, 200, res);
});

// Update user data
exports.updateProfile = catchAsyncError(async (req, res, next) =>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        user
    })
});

// Get all users for Admin
exports.getAllUsers = catchAsyncError(async (req, res, next)=>{

    const users = await User.find();
    // console.log("users-----", users);
    res.status(200).json({
        success:true,
        users
    })
});

// Get single user for Admin
exports.getSingleUser = catchAsyncError(async (req, res, next)=>{

    const user = await User.findById(req.params.id);

    if (! user){
        return next(new ErrorHandler(`User does not Exist with ID: ${req.params.id}`, 404));
    }
    res.status(200).json({

        success:true,
        user
    })
});