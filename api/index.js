const express = require('express');
const post = require('./post');
const router = express.Router();
const user = require('./user');

router.use('/users',user);
router.use('/posts',post);


module.exports = router;