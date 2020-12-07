const blogRouter = require('express').Router()
const BlogController = require('../controllers/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', middleware.authMiddleware, BlogController.getAllBlogs)
blogRouter.post('/', middleware.authMiddleware, BlogController.createBlog)
blogRouter.put('/:id', BlogController.updateBlog)
blogRouter.get('/:id/comments', BlogController.getComments)
blogRouter.put('/:id/comments', BlogController.addComment)
blogRouter.delete('/:id', BlogController.deleteBlog)

module.exports = blogRouter