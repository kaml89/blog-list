const User = require('../models/user.js')

module.exports = {
    getAll: async () => {
        const users = await User
            .find({})
            .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
        return users
    },

    getUserById: async (id) => {
        const user = await User.findById(id)
        return user
    },
    
    create: async (user) => {
        const newUser = new User(user)
        const savedUser = await newUser.save()
        return savedUser
    },

    update: async (id, update) => {
        const updatedUser = await User.findByIdAndUpdate(id, update)
        return updatedUser
    },

    delete: async (id) => {
        const deletedUser = await BlogService.delete(id)
        return deletedUser
    }
}