const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct, createProductReview, getAllReviews, deleteReview } = require('../controllers/productController');
const {isAuthenticateUser , authorizeRoles}= require('../middleware/auth');

const router = express.Router();

router.route('/products').get(getAllProducts);
router.route('/product/new').post(isAuthenticateUser, authorizeRoles("admin"), createProduct);
router.route('/product/:id').put(isAuthenticateUser, authorizeRoles("admin"), updateProduct);
router.route('/product/:id').delete(isAuthenticateUser, authorizeRoles("admin"), deleteProduct);
router.route('/product/:id').get(getSingleProduct);
router.route('/review').put(isAuthenticateUser, createProductReview);
router.route('/reviews').get(getAllReviews).delete(isAuthenticateUser, deleteReview);
module.exports = router;