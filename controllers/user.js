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
    
    const { username, name, password } = request.body
    
    if (username && name && password && password.length >= 3) {
      const saltRounds = 10

      const passwordHash = await bcrypt.hash(password, saltRounds)
      const user = new User({
        username,
        name,
        passwordHash
      })

      const savedUser = await user.save()

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