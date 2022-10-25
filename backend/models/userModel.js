const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required: [true, "Please Enter Name"],
        maxLength: [30, "Name can not exceed 30 Characters."],
        minLength: [4, "Name should have atleast 4 Characters."]
    },
    email:{
        type:String,
        required: [true, "Please Enter Email."],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email."]
    },
    password:{
        type:String,
        required: [true, "Please Enter Password."],
        minLength: [8, "Password must have atleast 8 Characters."],
        select: false
    },
    avatar:{
        public_id:{
            type:String,
            required: true
        },
        url:{
            type:String,
            required: true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken: String,

    resetPasswordExpire: Date,
})

// Encrypt password
userSchema.pre("save", async function(next){

    if (! this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Compare Password
userSchema.methods.comparePassword = async function(pass){
    return await bcrypt.compare(pass, this.password);
}

// Generate Reset Token Password
userSchema.methods.getResetPasswordToken = async function(){

    // Generate Token
    // console.log(">>>>>>>>>>>>>>>>")
    const resetToken = crypto.randomBytes(15).toString("hex");

    // Hashing and adding ResetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Token is only Valid till 15 minutes
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model("User", userSchema);