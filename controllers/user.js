const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response, next) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
    response.json(users.map(user => user.toJSON()))

  } catch(exception) {
    next(exception)
  }
})

userRouter.post('/', async (request, response, next) => {
  try {
    console.log('1111111111111111111111')
    const { email, username, name, password } = request.body
    console.log('000000000000000')
    if (email && username && name && password && password.length >= 3) {
      const saltRounds = 10

      const passwordHash = await bcrypt.hash(password, saltRounds)
      console.log('111111111111111111111')
      const user = new User({
        email,
        username,
        name,
        passwordHash
      })
      console.log('222222222222222222')
      const savedUser = await user.save()
      console.log('3333333333333333333333')
      response.status(201).json(savedUser.toJSON())
    }
    else {
      response.status(400).json({error: 'invalid request'})
    }
    
    
  } catch(exception) {
    next(exception)
  }
  
})

module.exports = userRouter