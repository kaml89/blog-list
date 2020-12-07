//const authRouter = require('express').Router()
const jwt = require('jsonwebtoken')
//const User = require('../models/user')
const UserService = require('../services/user')
const bcrypt = require('bcrypt')
const createResponseObject = require('../utils/createResponseObject')

module.exports = {
  login: async (request, response, next) => {
    try {
      const { username, password } = request.body
      console.log(username)
      
      const user = await UserService.findByUsername(username)

      const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
      if (!(user && passwordCorrect)) {
        return response
          .status(401)
          .json({ status: 401, error: 'invalid login or password' })
            
      }
      
      const userForToken = {
        user: user.username,
        id: user._id
      }
      
      const token = jwt.sign(userForToken, process.env.SECRET)

      const responseObject = { token, username: user.username, name: user.name, id:user.id }
      return response
        .status(200)
        .json({ status: 200, data: responseObject })

    } catch(error) {
      next(error)
    }
  },

  register: async (request, response, next) => {
    try {
      const { email, username, name, password } = request.body
      
      const user = {
        email,
        username,
        name,
        passwordHash: password
      }
  
      const newUser = await UserService.create(user)
  
      response
        .status(201)
        .json({ status: 201, data: newUser.toJSON() })
  
    } catch(error) {
      next(error)
    }
  }
}