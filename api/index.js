const express = require('express');
const router = express.Router();
const user = require('./user');
const post = require('./post');
const image = require('./image');

router.use('/users', user);
router.use('/posts', post);
router.use('/image', image);

module.exports = router;