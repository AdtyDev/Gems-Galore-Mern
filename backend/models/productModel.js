const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter the Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter the Product description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter the Price of the Product"],
        maxLength:[8,"Price cannot exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[ 
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter the Product Category"]

    },
    Stock:{
        type:Number,
        required:[true,"Please Enter the Stock of the Product"],
        maxLength:[4,"Stock cannot exceed 4 Digits"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
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
                required:true 
            }
        }
    ],
// to check who created the product
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.Now 
    }
})

module.exports= mongoose.model("Product", productSchema);