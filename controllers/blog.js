const blogRouter = require('express').Router()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({})
    .populate('user', { name: 1, username: 1, blogs: 1, id: 1 })

  console.log(blogs.length)
  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', async (request, response, next) => {

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({error: 'missing or invalid token'})
    }
    const { title, author, url } = request.body
    const user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
      title,
      author,
      url,
      user: user._id
    })

    const savedBlog = await newBlog.save()
    
    const updatedUser = {
      ...user.toJSON(),
      blogs: [ ...user.blogs, savedBlog.id]
    }
    await User.findByIdAndUpdate(user._id, updatedUser)
    
    response.json(savedBlog.toJSON())
  
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
    const { url, author, title, user, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {
      title,
      author,
      url,
      user,
      likes
    }, { new: true })
    response.json(updatedBlog.toJSON())
    
  } catch(error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    

    if(!request.token || !decodedToken.id || blog.user.toString() !== decodedToken.id) {
      return response.status(401).json({error: 'missing or invalid token'})
    }

    const updatedUser = {
      ...user.toJSON(),
      blogs: user.blogs.filter(item => item.toString() !== blog.id)
    }

    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    await User.findByIdAndUpdate(decodedToken.id, updatedUser)

    response.json(deletedBlog.toJSON())

  } catch(error) {
    next(error)
  }
})

module.exports = blogRouter