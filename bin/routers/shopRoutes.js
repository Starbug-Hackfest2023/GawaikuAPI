const express = require('express');

const userAuth = require('../middlewares/userAuth');

const router = express.Router();

const shopController = require('../modules/shopController');

// router.post('/loginUser', authController.loginUser);
router.get('/shopList', userAuth, shopController.shopList);

module.exports = router; 