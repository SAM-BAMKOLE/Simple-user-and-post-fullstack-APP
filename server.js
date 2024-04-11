require('dotenv').config();
const express = require('express')
const path = require('path')
const port = process.env.PORT || 5000
const { connectDB } = require(path.join(__dirname, 'config', 'db.js'))
const cookieParser = require('cookie-parser')
const userRoutes = require(path.join(__dirname, 'routes', 'user.js'))
const authRoutes = require(path.join(__dirname, 'routes', 'auth.js'))
const postRoutes = require(path.join(__dirname, 'routes', 'post.js'))
const { notFound, errorHandler } = require(path.join(__dirname, 'middlewares', 'errorHandler.js'))
const verifyJWT = require(path.join(__dirname, 'middlewares', 'verifyJWT.js'))
const clientRoutes = require(path.join(__dirname, 'routes', 'client.js'))


const app = express();
connectDB();

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'views')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

/*
app.get('/', (req, res)=> res.render('index'));
app.get('/auth/signin', (req, res)=>res.render('auth/signin'))
*/
app.use('/', clientRoutes)
app.use('/auth', authRoutes)
app.use('/post', postRoutes)

//app.use(verifyJWT)
app.use('/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
})
