const blogRouter = require('express').Router()
const BlogController = require('../controllers/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', middleware.authMiddleware, BlogController.getAllBlogs)
blogRouter.post('/', middleware.authMiddleware, BlogController.createBlog)
blogRouter.put('/:id', middleware.authMiddleware, BlogController.updateBlog)
blogRouter.get('/:id/comments', middleware.authMiddleware, BlogController.getComments)
blogRouter.put('/:id/comments', middleware.authMiddleware, BlogController.addComment)
blogRouter.delete('/:id', middleware.authMiddleware, BlogController.deleteBlog)

module.exports = blogRouter