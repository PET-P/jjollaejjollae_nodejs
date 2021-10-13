const express = require('express');
const router = express.Router();
const user = require('./user');
const post = require('./post');
const keyword = require('./keyword');
const auth = require('./auth');
const place = require('./place');
const search = require('./search')
const review = require('./review');
const wishlist = require('./wishlist');


router.use('/users', user);
router.use('/posts', post);
router.use('/keyword', keyword);
router.use('/auth',auth);
router.use('/places',place);
router.use('/search',search);
router.use('/reviews', review);
router.use('/wishlist', wishlist);

module.exports = router;