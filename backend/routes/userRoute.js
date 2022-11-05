const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDeatils, updatePassword, updateProfile, getAllUsers, getSingleUser } = require('../controllers/userController');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route('/user/register').post(registerUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').get(logoutUser);
router.route('/user/reset/password').post(forgotPassword);
router.route('/reset/password/:token').put(resetPassword);
router.route('/me').get(isAuthenticateUser, getUserDeatils);
router.route('/password/update').put(isAuthenticateUser, updatePassword);
router.route('/me/update').put(isAuthenticateUser, updateProfile);
router.route('/admin/users').get(isAuthenticateUser, authorizeRoles("admin"), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticateUser, authorizeRoles("admin"), getSingleUser);



module.exports = router;