var express = require('express')
var router = express.Router();

router.use('/items',require('./items'))

module.exports = router;