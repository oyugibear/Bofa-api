const { validationResult } = require("express-validator")
const RequestValidatorError = require("../errors/request-validator-error")

const RequestValidator = (req, res, next)  => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        throw new RequestValidatorError(errors.array(), 400)
    }

    next()
}

module.exports = RequestValidator