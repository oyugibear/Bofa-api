class CustomError extends Error {
    constructor(message, statusCode) {
        super(message)
        if(new.target === CustomError) {
            throw new TypeError("Abstarct class 'CustomError' cannot be instantiated")
        }
        this._statusCode = statusCode
        Object.setPrototypeOf(this, new.target.prototype)
    }

    get statusCode() {
        if(typeof this._statusCode === 'undefined') {
            throw new Error("Absttact getter 'statusCode' has not been implemented.")
        }
        return this._statusCode
    }

    set statusCode(value) {
        this._statusCode = value
    }
    
    serializeErrors() {
        throw new Error("Absttact method 'serializeErrors' has not been implemented.")
    }
}

module.exports = CustomError