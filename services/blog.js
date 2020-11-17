const { update } = require('../models/blog')
const Blog = require('../models/blog')

module.exports = {
    getAllBlogs: async () => {
        const blogs = await Blog
            .find({})
            .populate('user', { name: 1, username: 1, blogs: 1, id: 1 })
        return blogs
    },

    getBlogById: async (id) => {
        const blog = await Blog.findById(id)
        return blog
    },
    
    create: async (blog) => {
        const newBlog = new Blog(blog)
        const savedBlog = await newBlog.save()
        return savedBlog
    },

    incrementLikes: async (id) => {
        const updatedBlog = await Blog.findByIdAndUpdate(id, {
            $inc: { likes: 1 }
          }, { new: true })
          return updatedBlog
    },

    addComment: async (id, newComment) => {
        const updatedBlog = await Blog.findByIdAndUpdate(id, {
            $push: { comments: newComment }
          }, { new: true })
        return updatedBlog
    },

    delete: async (id) => {
        const deletedBlog = await Blog.findByIdAndDelete(id)
        return deletedBlog
    }

}