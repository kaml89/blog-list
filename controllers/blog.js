const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const BlogService = require('../services/blog.js')
const UserService = require('../services/user.js')
const createResponseObject = require('../utils/createResponseObject')

blogRouter.get('/', async (request, response, next) => {
  const blogs = BlogService.getAllBlogs()

  response.json(blogs.map(blog => blog.toJSON()))
  next()
})

blogRouter.post('/', async (request, response, next) => {

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({error: 'missing or invalid token'})
    }
    const { title, author, url } = request.body
    const user = await UserService.getUserById(decodedtoken.id)

    const newBlog = await BlogService.create({
      title,
      author,
      url,
      user: user._id
    })

    const updatedUser = {
      ...user.toJSON(),
      blogs: [ ...user.blogs, newBlog.id]
    }

    await UserService.update(user._id, updatedUser)

    const responseObject = {
      ...newBlog.toJSON(),
      user: updatedUser
    }

    response.json(responseObject)
  
  } catch(error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({error: 'missing or invalid token'})
    }
    
    const updatedBlog = await BlogService.incrementLikes(request.params.id)
    
    response.json(updatedBlog.toJSON())
    
  } catch(error) {
    next(error)
  }
})

blogRouter.get('/:id/comments', async (request, response, next) => {
  try {
    const blog = await BlogService.getBlogById(request.params.id)
    response.json(blog.comments)
  } catch(error) {
    next(error)
  }
})

blogRouter.put('/:id/comments', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({error: 'missing or invalid token'})
    }
    
    const updatedBlog = await BlogService.addComment(request.params.id, request.body.data)
    response.json(updatedBlog.toJSON())

    } catch(error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await UserService.getUserById(decodedToken.id)
    const blog = await BlogService.getBlogById(request.params.id)
    

    if(!request.token || !decodedToken.id || blog.user.toString() !== decodedToken.id) {
      return response.status(401).json({error: 'missing or invalid token'})
    }

    const updatedUser = {
      ...user.toJSON(),
      blogs: user.blogs.filter(item => item.toString() !== blog.id)
    }

    const deletedBlog = await BlogService.delete(request.params.id)
    await UserService.update(decodedToken.id, updatedUser)

    response.json(deletedBlog.toJSON())

  } catch(error) {
    next(error)
  }
})

module.exports = blogRouter