const express = require('express');
const router = express.Router();
const user = require('./user');
const post = require('./post');
const image = require('./image');
const accomm = require('./accomm');
const cafe = require('./cafe');
const restaurant = require('./restaurant');
const spot = require('./spot');

router.use('/users', user);
router.use('/posts', post);
router.use('/image', image);
router.use('/accomms', accomm);
router.use('/cafes', cafe);
router.use('/restaurants', restaurant);
router.use('/spots', spot);

module.exports = router;