const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


router.route("/products").get( getAllProducts);

// to create a new product
router.route("/admin/product/new").post( isAuthenticatedUser,authorizeRoles("admin"),createProduct);

// to update product
router.route("/admin/product/:id").put( isAuthenticatedUser,authorizeRoles("admin"),updateProduct);

// to delelte product
router.route("/admin/product/:id").delete( isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews);

router.route("/reviews").delete(isAuthenticatedUser, deleteReview);


module.exports = router;