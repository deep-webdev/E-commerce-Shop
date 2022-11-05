const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please Enter Product Name..."],
        maxLength:[120, "Product Name must be within 120 Character..."]
    },
    description:{
        type:String,
        required: [true, "Describe your Product First..."]
    },
    price:{
        type:Number,
        required: [true, "Please Enter product price..."],
        maxLength: [9, "Price is not Valid for your product..."]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required: true
            },
            url:{
                type:String,
                required: true
            }
        }
    ],
    category:{
        type:String,
        required: [true, "Please Enter Product Category..."]
    },
    stock:{
        type:Number,
        required: [true, "Please Enter Product Stock..."],
        maxLength: [4],
        default: 1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews: [
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required: true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Product", productSchema);