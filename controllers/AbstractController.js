// const CustomError = require("../errors/custom-error")
class AbstractController {
  /**
   * Function for sending a success response
   * @param {{}} res Response object
   * @param {{}} data Response data
   * @param {number} code Success code
   * @param {string} error Success Message
   */
  static successResponse(res, data, code = 200, message = "Success") {
    res.status(code).send({
      data,
      message,
      status: "ok",
    })
  }

  /**
   * Function for sending a failure response
   * @param {{}} res Response object
   * @param {number} code Error code
   * @param {{}} error Error object
   */
  static errorResponse(res, code = 500, error) {
    console.error("***ERROR***", error.message, JSON.stringify(error));
    
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

    res.status(code).json({
      status: "failed",
      errors: [{ message: errorMessage }]
    });
  }

}

module.exports = AbstractController
