const path = require('path')
const Post = require(path.join(__dirname, '..', 'models', 'post.js'))
const { User } = require(path.join(__dirname, '..', 'models', 'user.js'))
const asyncHandler = require('express-async-handler')
const ROLES_LIST = require(path.join(__dirname, '..', 'config', 'rolesList.js'))

const getPost = asyncHandler(async (req, res)=>{
  const postId = req.params.postId
  
  const post = await Post.findById(postId).populate('author')
  if (!post) {
    res.status(400)
    throw new Error('Invalid ID: this post does not exist')
  }
  res.status(200).json({ response: post })
})


const createPost = asyncHandler(async (req, res)=>{
  const { title, content } = req.body

  if (!title || !content) {
    res.status(400) // invalid request
    throw new Error('All fields are required!')
  }

  const userId = req.user
  if (!userId) {
    res.status(409)
    throw new Error('Please sign in  first!')
  }

  const user = await User.findById(userId)
  if (!user) {
    res.status(403)
    throw new Error('Invalid user id. User does not exist.')
  }

  const post = await Post.create({ title, content, userId })


  if (!post) {
    res.status(501);
    throw new Error('Unable to create new post')
  }

  await user.posts.push(post._id)
  await user.save()

  // res.status(201).json({ message: 'Post created successfully', response: post })
  res.redirect('/post')
})

const deletePost = asyncHandler(async (req, res)=>{
  const { postId } = req.params
  const user = req.user
  const userRoles = req.roles
  
  if(!postId) {
    res.status(400)
    throw new Error('No id selected')
  }
  
  const post = await Post.findById(postId)
  if (!post) {
    res.status(403)
    throw new Error('Post does not exist')
  }
  
  if(post.userId === user || userRoles.includes(ROLES_LIST.Admin)) {
    deleteFunc()
  } else {
    res.status(409) // Unauthenticated
    throw new Error('Unauthenticated: Not allowed to delete this post')
  }
  //const result = await post.deleteOne()
  async function deleteFunc() {
    const result = await Post.deleteOne({ _id: post._id });
    res.status(200).json({ message: 'Post deleted', response: result })
  }
})


const userPosts = asyncHandler(async (req, res)=>{
  const userId = req.user
  
  if (!userId){
    res.status(400)
    throw new Error('Invalid request, please log in first')
  }

  const userPosts = await Post.find({ userId: userId }).sort({ createdAt: -1 }).exec()
  // res.status(200).json({ response: userPosts })
  res.render('post/index', { response: userPosts })
})

const updatePost = asyncHandler(async (req, res)=>{
  const postId = req.params.postId
  const post = await Post.findById(postId)
  if (!post) {
    res.status(400)
    throw new Error('This post does not exist')
  }
  // get current user
  const userId = req.user
  
  if (post.userId != userId){
    res.status(403)
    throw new Error('Not authorized to update this post')
  }
  const { title, content } = req.body
  post.title = title
  post.content = content

  const response = await post.save()

  if (!response) {
    res.status(500)
    throw new Error('Unable to update post')
  }
  res.json({ message: 'Post updated successfully!'})

})


module.exports = { createPost, getPost, deletePost, userPosts, updatePost }

