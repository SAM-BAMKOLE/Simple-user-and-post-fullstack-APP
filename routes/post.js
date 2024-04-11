const express = require('express')
const router = express.Router()
const path = require('path')
const { createPost, getPost, deletePost, userPosts, updatePost } = require(path.join(__dirname, '..', 'controllers', 'post.js'));
const verifyJWT = require(path.join(__dirname, '..', 'middlewares', 'verifyJWT.js'))

router.get('/', verifyJWT, userPosts)
router.route('/:postId').delete(verifyJWT, deletePost).put(verifyJWT, updatePost);
router.get('/:postId', getPost)
router.post('/new', verifyJWT, createPost);


module.exports= router
