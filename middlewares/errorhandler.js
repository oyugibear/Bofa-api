const AppError = require("../errors/app-error")
const CustomError = require("../errors/custom-error")

const handleCastError = (error) => {
  const message = `invalid ${error.path} ${error.value}`
  return new AppError(message, 400)
}

const handleDuplicates = (error) => {
  const message =  `email ${error.keyValue.email} is taken, please use a unique email address to signup`
  return new AppError(message, 400)
}

const hanldeJsonWebToken = () => {
  const message = `login session expired, please login or signup`
  return new AppError(message, 401)
}

const handleTokenExpired = () => {
  const message = `login session expired, please login or signup`
  return new AppError(message, 401)
}

const handleBsonTypeError = () => {
  const message = `Argument passed in must be a string of 12 bytes or a string of 24 hex characters`
  return new AppError(message, 400)
}

const errorHandler = (err, req, res, next) => {
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err); 
  error.message = err.message


  if(error.name === 'CastError') error = handleCastError(err)
  if(error.code === 11000) error = handleDuplicates(err)
  if(error.name === 'JsonWebTokenError') error = hanldeJsonWebToken()
  if(error.name === 'TokenExpiredError') error = handleTokenExpired()
  if (error.name === 'BSONTypeError') error = handleBsonTypeError()
  /**
   * @todo
   * cast error -> error instance of CustomError
   */

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ errors: error.serializeErrors() })
  }

  res.status(500).json({ status: 'internal server error', errors: [{ message: "Something went wrong" }]})
}

module.exports = errorHandler
