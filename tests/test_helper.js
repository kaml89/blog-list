const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'blog1',
    author: 'kamil',
    url: 'sdf',
    likes: 21
  }, 
  {
    title: 'blog2',
    author: 'dawid',
    url: 'jklhkjhkjh',
    likes: 11
  }
]

// const initialUsers = [
//   {
//     username: { type: String, unique: true },
//     passwordHash: String,
//     name: String,
//     blogs: [{ type: Schema.Types.ObjectID, ref: 'Blog' }]
//   }
  
// ]

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

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, blogsInDB, createInitialUsers, usersInDB
}