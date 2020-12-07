const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { request } = require('express')


const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method)
  logger.info('Path:', req.path)
  logger.info('Body: ', req.body)
  logger.info('---')
  next()
}

const errorHandler = (err, req, res, next) => {
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      error: 'invalid token'
    })
  }

  else if (err.name === "ValidationError") {
    res.status(400).json({
      error: err
    })
  }
  next(err)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  if(authorization) {
    req.token = authorization.substring(7)
  }
  next()
}

const authMiddleware = (req, res, next) => {
  const token = req.token || req.headers["x-access-token"] || req.headers['authorization']
  if (!token) {
    return res.status(401).send('missing token')
  }
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    req.user = decodedToken
    next()
  } catch(error) {
    next(error)
  }
}



module.exports = {
  requestLogger, errorHandler, tokenExtractor, authMiddleware
}
