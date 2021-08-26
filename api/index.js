const express = require('express');
const router = express.Router();
const user = require('./user');
const post = require('./post');
const image = require('./image');
const auth = require('./auth');

router.use('/users', user);
router.use('/posts', post);
router.use('/image', image);
router.use('/auth',auth);

module.exports = router;