const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  console.log(username)
  const user = await User.findOne({username})

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid login or password'
    })
  }
  
  const userForToken = {
    user: user.username,
    id: user._id
  }
  
  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .json({ token, username: user.username, name: user.name, id:user.id })

})

module.exports = loginRouter
