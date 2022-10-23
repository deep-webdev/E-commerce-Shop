const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


module.exports = mongoose.model("User", userSchema);