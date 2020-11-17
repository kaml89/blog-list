const logger = require('./logger')

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


module.exports = {
  requestLogger, errorHandler, tokenExtractor
}
