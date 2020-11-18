const blogRouter = require('express').Router()
const BlogController = require('../controllers/blog')

blogRouter.get('/', BlogController.getAllBlogs)
blogRouter.post('/', BlogController.createBlog)
blogRouter.put('/:id', BlogController.updateBlog)
blogRouter.get('/:id/comments', BlogController.getComments)
blogRouter.put('/:id/comments', BlogController.addComment)
blogRouter.delete('/:id', BlogController.deleteBlog)

module.exports = blogRouter