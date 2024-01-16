const express = require('express');

const userAuth = require('../middlewares/userAuth');

const router = express.Router();

const orderController = require('../modules/orderController');

router.post('/', userAuth, orderController.userOrder);

module.exports = router;