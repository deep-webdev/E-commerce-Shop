const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword } = require('../controllers/userController');

const router = express.Router();

router.route('/user/register').post(registerUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').get(logoutUser);
router.route('/user/reset/password').post(forgotPassword);



module.exports = router;