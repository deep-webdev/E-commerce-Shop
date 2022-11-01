const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDeatils, updatePassword, updateProfile } = require('../controllers/userController');
const { isAuthenticateUser } = require('../middleware/auth');
const router = express.Router();

router.route('/user/register').post(registerUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').get(logoutUser);
router.route('/user/reset/password').post(forgotPassword);
router.route('/reset/password/:token').put(resetPassword);
router.route('/me').get(isAuthenticateUser, getUserDeatils);
router.route('/password/update').put(isAuthenticateUser, updatePassword);
router.route('/me/update').put(isAuthenticateUser, updateProfile);



module.exports = router;