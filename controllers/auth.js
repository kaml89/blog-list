//const authRouter = require('express').Router()
const jwt = require('jsonwebtoken')
//const User = require('../models/user')
const UserService = require('../services/user')
const bcrypt = require('bcrypt')
const createResponseObject = require('../utils/createResponseObject')

// authRouter.post('/login', async (request, response) => {
//   const { username, password } = request.body
//   console.log(username)

//   const user = await UserService.findByUsername(username)

//   const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
//   if (!(user && passwordCorrect)) {
//     return response
//       .status(401)
//       .json(
//         createResponseObject(null ,'invalid login or password')
//       )
//   }
  
//   const userForToken = {
//     user: user.username,
//     id: user._id
//   }
  
//   const token = jwt.sign(userForToken, process.env.SECRET)

//   const responseObject = createResponseObject({ token, username: user.username, name: user.name, id:user.id })
//   response
//     .status(200)
//     .json(responseObject)

// })

// authRouter.post('/register', async (request, response, next) => {
//   try {
//     const { email, username, name, password } = request.body
    
//     const user = {
//       email,
//       username,
//       name,
//       passwordHash: password
//     }

//     const newUser = await UserService.create(user)

//     response
//       .status(201)
//       .json( newUser.toJSON())

//   } catch(error) {
//     next(error)
//   }
// }) 

//module.exports = authRouter

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
        .json( newUser.toJSON())
  
    } catch(error) {
      next(error)
    }
  }
}