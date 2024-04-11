const express = require('express')
const router = express.Router()
const path = require('path')
const { signUp, signIn } = require(path.join(__dirname, '..', 'controllers', 'user.js'))

router.post('/signup', signUp)
router.post('/signin', signIn)


module.exports = router;
