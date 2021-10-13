const express = require('express')
const router = express.Router()
const searchController = require('./search')
const { optionalAuthJWT } = require('../../middleware/authJWT');

router.get('', optionalAuthJWT, searchController.search)

module.exports = router