const CustomError = require("./custom-error")
class RequestValidatorError extends CustomError {
    constructor(errors, statusCode) {
        super()
        this.statusCode = statusCode
        this.errors = errors

    Object.setPrototypeOf(this, RequestValidatorError.prototype)
  }

  serializeErrors() {
    const formattedError = this.errors.map((value) => {
      if (value.type === "field") {
        return {
          message: value.msg,
          field: value.path,
        }
      }
      return { message: value.msg }
    })

    return formattedError
  }
}
module.exports = RequestValidatorError
