const express = require('express')
const router = express.Router()
const searchController = require('./search')

router.get('',searchController.search)

module.exports = router