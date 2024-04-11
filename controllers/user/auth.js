require('dotenv').config()
const jwt = require('jsonwebtoken')
const path = require('patj')
const User = require(path.join(__dirname, '..', '..'))


const signIn = (req, res)=>{
  const { user, password } = req.body

  if (!user || !password) {
    res.status(400)
    throw new Error('Email or Username and Password are required')
  }
    
  // check if user already exists
  const nameExists = User
}


