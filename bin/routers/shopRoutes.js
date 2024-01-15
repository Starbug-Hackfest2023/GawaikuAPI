const express = require('express');

const userAuth = require('../middlewares/userAuth');

const router = express.Router();

const shopController = require('../modules/shopController');

router.get('/shopList', userAuth, shopController.shopList);
router.get('/:username', userAuth, shopController.viewShop);
// router.get('/shopList', shopController.shopList);

module.exports = router; 