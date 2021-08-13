const express = require('express');
const router = express.Router();
const user = require('./user');
const auth = require('./auth');


router.use('/users',user);
router.use('/auth',auth);

module.exports = router;