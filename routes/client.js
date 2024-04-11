const express = require('express')
const path = require('path')
const router = express.Router();



router.get('/', (req, res)=> {
  res.render('index', { response: res.response })
})
router.get('/auth/signin', (req, res)=>{
  res.render('auth/signin')
})
router.get('/auth/signup', (req, res)=>{
  res.render('auth/signup')
})
router.get('/post/create', (req, res)=>{
  res.render('post/create')
})



module.exports = router;
