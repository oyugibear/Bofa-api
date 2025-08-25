const CustomError = require("./custom-error")

class AppError extends CustomError {
    
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode

        Object.setPrototypeOf(this, AppError.prototype)
    }

    serializeErrors() {
        return [{
            message: this.message
        }]
    }
}

module.exports = AppError