const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuthenticateUser = catchAsyncError(async(req, res, next)=>{
    const { token } = req.cookies;

    if (!token){
        return next(new ErrorHandler("Please login to access this Resource", 401));
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);

    next();
})

module.exports = isAuthenticateUser;