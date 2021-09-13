const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const initialBlogs = [
  {
    title: 'blog1',
    author: 'kamil',
    url: 'sdf',
    likes: 21,
    _id: new mongoose.Types.ObjectId()
  }, 
  {
    title: 'blog2',
    author: 'dawid',
    url: 'jklhkjhkjh',
    likes: 11,
    _id: new mongoose.Types.ObjectId()
  }
]

const createInitialUsers = async () => {
  const initialUsers = []
  for (let i =0; i < 3; i++) {
    let hash = await bcrypt.hash(`password${i}`, 10)
    // const user = {
    //   username: `user${i}`,
    //   name: `name${i}`,
    //   passwordHash: hash
    //   //blogs: []
    // }
    initialUsers.push({
      username: `username${i}`,
      name: `name${i}`,
      passwordHash: hash
      //blogs: []
    })
  }
  return initialUsers
}

const getBlogsFromDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getUsersFromDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog(initialBlogs[0])
  const newBlog = await blog.save()
  const id = newBlog.id
  await Blog.findByIdAndDelete(id)
  return id
}

const addBlog = async (userId) => {
  
}

module.exports = {
  initialBlogs, getBlogsFromDB, createInitialUsers, getUsersFromDB, nonExistingId
}