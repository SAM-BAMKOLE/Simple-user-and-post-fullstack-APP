# Simple User and Post API

A simple nodejs and express app that allows users create an account  \(signup\), signin and manage their posts.

![Turtle in the sea](https://source.unsplash.com/brown-turtle-swimming-underwater-L-2p8fapOA8)

## How it works
* Users can create account
* They can signin
* An admin can make other admins \(route not handled yet\)
* Users can manage \( create, view, update and delete \) their posts
* Admins can delete any post
* Frontend embedded with the backend
* Built with Htmx and Bootstrap


## Routes
The routes are basically divided into three segments - \(auth, user and post\)

_**Auth Routes**_
* Signin - /auth/signin
* Signup - /auth/signup

_**User Routes**_
* View all users (Admin) - /user/
* Update current user's username - /user/update-username
* Update current user's password - /user/update-password
* ....

_**Post Routes**_
* Get all current users posts - /post/:userId
* Get single post - /:postId
* Update post (can only update your post) - /:postId
* Delete post (can only delete your post) - /:postId
* .....

## Tools
_**Backend**_
* Nodejs \(expressjs\)
* Mongodb \(mongoose\)
* jwt
* bcrypt

_**Frontend**_
* Htmx
* Bootstrap
