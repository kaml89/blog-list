const authRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const createResponseObject = require('../utils/createResponseObject')

authRouter.post('/login', async (request, response) => {
  const { username, password } = request.body
  console.log(username)
  const user = await User.findOne({username})

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    return response
      .status(401)
      .json(
        createResponseObject(null ,'invalid login or password')
      )
  }
  
  const userForToken = {
    user: user.username,
    id: user._id
  }
  
  const token = jwt.sign(userForToken, process.env.SECRET)

  const responseObject = createResponseObject({ token, username: user.username, name: user.name, id:user.id })
  response
    .status(200)
    .json(responseObject)

})

authRouter.post('/register', async (request, response, next) => {
  try {
    const { email, username, name, password } = request.body

    const user = new User({
      email,
      username,
      name,
      passwordHash: password
    })

    const newUser = await user.save()
    
    response
      .status(201)
      .json( newUser.toJSON())

  } catch(error) {
    next(error)
  }
}) 

module.exports = authRouter
