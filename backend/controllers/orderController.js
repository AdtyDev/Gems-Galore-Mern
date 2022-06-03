const Order = require("../models/orderModels");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create new Order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
  
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });
  
    res.status(201).json({
      success: true,
      order,
    });
  });

  //Get single Order
  
  exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next(new ErrorHandler("Order not Found via this ID",404));
    }

    res.status(200).json({
        success: true,
        order,
    })
  });

    //Get Log in user Order
  
    exports.myOrders = catchAsyncError(async(req,res,next)=>{

        const orders = await Order.find({user: req.user._id})
    
        res.status(200).json({
            success: true,
            orders,
        })
      });

    //Get all Order -- ADMIN
  
    exports.getAllOrders = catchAsyncError(async(req,res,next)=>{

        const orders = await Order.find();

        let totalAmount=0;

        orders.forEach(order=>{
            totalAmount += order.totalPrice;
        });
    
        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        })
      });

      //Update Order Status -- ADMIN
  
    exports.updateOrder = catchAsyncError(async(req,res,next)=>{

        const order = await Order.findById(req.params.id);
        
        if(!order){
            return next(new ErrorHandler("Order not Found via this ID",404));
        }

        if(order.orderStatus==="Delivered"){
            return next(new ErrorHandler("You have Already delivered this Order",400));
        }

        order.orderItems.forEach(async(order)=>{
            await updateStock(order.product,order.quantity);
        });

        order.orderStatus = req.body.status;
        
        if(req.body.status==="Delivered"){
            order.deliveredAt=Date.now();
        }

        await order.save({ validateBeforeSave: false});
        res.status(200).json({
            success: true,
        })
      });

      async function updateStock (id,quantity){
          
        const product = await Product.findById(id);
 
        product.Stock -= quantity;

        await product.save({ validateBeforeSave: false});
      }

      //DELETE Order -- ADMIN
  
    exports.deleteOrder = catchAsyncError(async(req,res,next)=>{

        const order = await Order.findById(req.params.id);

        if(!order){
            return next(new ErrorHandler("Order not Found via this ID",404));
        }

        await order.remove();
    
        res.status(200).json({
            success: true,
            
        })   
      });