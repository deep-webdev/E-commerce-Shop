const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');

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

    const resetLink = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password Reset token is: \n\n ${resetLink} \n\n If you have not requested this email then
    please ingore it.`

    try{
        console.log("IN Try.....>>>>>")
        await sendEmail({
            email:user.email,
            subject: `E-commerce Password Recovery`,
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`
        })

    } catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
        next(new ErrorHandler(error.message, 500))
    }
})