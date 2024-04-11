const path = require('path')
const { User } = require(path.join(__dirname, '..', 'models', 'user.js'))
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const ROLES_LIST = require(path.join(__dirname, '..', 'config', 'rolesList.js'))


/*
 *@ PRIVATE
 * */
const getUsers = asyncHandler(async (req, res)=> {
  const users = await User.find().select('-password -refreshToken').populate('posts')
  res.status(200).json({response: users})
})

const signUp = asyncHandler(async (req, res)=> {
  const { username, email, password } = req.body
  
  if (!username || !email || !password) {
    throw new Error('Username, Email and Password are required!')
  }
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(409)
    throw new Error('User already exists');
  }
  const newUser = await User.create({ username, email, password })
  res.status(201).json({ response: 'User created successfully', _id: newUser._id, username: newUser.username, email: newUser.email })
  })

const deleteUser = asyncHandler(async (req, res)=>{
  const userId = req.params.userId
  const user = await User.findOne({ _id: userId })

  if (!user) {
    res.status(406)
    throw new Error('User does not exist!')

  }
  const result = await User.deleteOne({ _id: user._id })
  
  res.status(200).json({ response: "User deleted successfully", _id: user._id, username: user.username, email: user.email, result })
})


// signin controller
const signIn = asyncHandler(async (req, res)=>{
  const { user, password } = req.body
  
  if(!user || !password){
    res.status(400)
    throw new Error('All fields are required')
  }
  const nameExists = await User.findOne({ username: user })
  
  const emailExists = await User.findOne({ email: user })
  
  
  if (!nameExists && !emailExists) {
    res.status(406)
    throw new Error('User does not exist')
  }
  const foundUser = nameExists || emailExists
  
  const roles = Object.values(foundUser.roles)

  // verify password
  const matchPwd = await foundUser.comparePassword(password)

  if (!matchPwd) {
    res.status(400)
    throw new Error('Invalid credentials')
  }

  const refreshToken = jwt.sign({ userId: foundUser._id }, process.env.REFRESH_TOKEN, { expiresIn: '1d' })

  const accessToken = jwt.sign({ userId: foundUser._id, roles }, process.env.ACCESS_TOKEN, { expiresIn: '10m' })

  foundUser.refreshToken = refreshToken
  await foundUser.save()

  // creqte http-only cookie with refreshToken
  res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
  
  // added this just because i dont want to send the access token to the frontend localstorage
  res.cookie('access', accessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 10 * 60 * 1000 })

  // send auth roles and token to user
  //res.status(200).json({ roles, accessToken })
  res.redirect('/post')
})

const handleRefresh = asyncHandler(async (req, res)=> {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    res.status(401)
    throw new Error('Unauthorized')
  }
  const refreshToken = cookies.jwt
  const foundUser = User.findOne({ refreshToken }).exec()
  if (!foundUser) {
    res.status(403)
    throw new Error('Unauthorized: Invalid token')
  }

  jwt.verify(foundUser.refreshToken, process.env.REFRESH_TOKEN, (err, decoded)=>{
    if (err || decoded.userId !== foundUser._id) {
      res.status(403)
      throw new Error('Unauthorized: unable to verify token')
    }
    const roles = Object.values(foundUser.roles)
    const accessToken = jwt.sign({ userId: decoded.userId, roles }, process.env.ACCESS_TOKEN, { expiresIn: '10m' })
  })

  res.status(200).json({ roles, accessToken });
})

const makeAdmin = asyncHandler(async (req, res)=>{
  const { userId } = req.body

  const user = await User.findOne({ _id: userId})
  if (!user) {
    res.status(400)
    throw new Error('Invalid user id')
  }
  user.roles.Admin = ROLES_LIST.Admin
  const result = await user.save()
  if (!result) {
    res.status(500)
    throw new Error('Unable to make user an Admin')
  }
  res.json({ message: 'Successfully made user an admin'})
})


const updateUsername = asyncHandler(async (req, res)=>{
  const { username} = req.body
  const userId = req.user
  const user = await User.findById(userId)
  if (!user) {
    res.status(401)
    throw new Error('User does not exist')
  }

  user.username = username
  await user.save()

  res.json({message: 'Username updated!'})
})

const updatePassword = asyncHandler(async (req, res)=>{
  const {previousPassword, password} = req.body
  const userId = req.user
  const user = await User.findById(userId)
  if (!user) {
    res.status(401)
    throw·new·Error('User does not exist')
  }

  if (previousPassword !== user.password){
    res.json({error: 'Wrong previous password'})
  }
  user.password = password
  await user.save();

  res.json({ message: 'Password changed!' })
})



module.exports = { getUsers, signUp, signIn, deleteUser, handleRefresh, makeAdmin, updateUsername, updatePassword }
