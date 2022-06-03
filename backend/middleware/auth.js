const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{

    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please Login to access this resource",401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();

});

exports.authorizeRoles=(...roles)=>{

    return (req,res,next)=>{ 
//403=meaning= server knows what u wanna do but still refuses it 
        if(!roles.includes(req.user.role)){
            
            return next (
                new ErrorHandler
                (`Role: ${req.user.role} is not allowed to access this resource`,403)
        )};

        next();
    }
}

