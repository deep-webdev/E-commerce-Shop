const express = require('express');
const { newOrder, getSingleOrder, myOrders, allOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

const { isAuthenticateUser, authorizeRoles } = require('../middleware/auth');

router.route('/order/new').post(isAuthenticateUser, newOrder);
router.route('/order/:id').get(isAuthenticateUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticateUser, myOrders);
router.route('/orders/all').get(isAuthenticateUser, authorizeRoles("admin"), allOrders);
router.route('/admin/orders').get(isAuthenticateUser, authorizeRoles("admin"), allOrders);
router.route('/admin/order/:id').put(isAuthenticateUser, authorizeRoles("admin"), updateOrderStatus)
                                .delete(isAuthenticateUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;