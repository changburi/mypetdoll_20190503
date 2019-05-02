const express = require('express');
let router = express.Router();

const admin = require('./admin');
const clothes = require('./clothes');
const cart = require('./cart');
const reload = require('./reload');
const purchase = require('./purchase');
const users = require('./users');
const unregistry = require('./unregistry');

router.use('/admin', admin)
router.use('/clothes', clothes)
router.use('/cart', cart)
router.use('/reload',reload)
router.use('/purchase', purchase)
router.use('/users', users)
router.use('/unregistry', unregistry)

module.exports = router;