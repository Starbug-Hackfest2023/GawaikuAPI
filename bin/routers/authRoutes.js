const express = require('express');

const userAuth = require('../middlewares/userAuth');

const router = express.Router();

const authController = require('../modules/authController');

router.post('/loginUser', authController.loginUser);
router.post('/loginShop', authController.loginShop);
router.post('/registerUser', authController.registerUser);
router.post('/registerShop', authController.registerShop);
router.get('/user/:id', userAuth, authController.viewUser);
router.get('/shop/:id', userAuth, authController.viewShop);
router.put('/user/:id', userAuth, authController.updateUser);
router.put('/shop/:id', userAuth, authController.updateShop);

module.exports = router; 