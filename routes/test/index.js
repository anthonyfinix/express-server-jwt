const router = require("express").Router();
const details = require('./details');


router.get('/',details)

module.exports = router;
