const express = require('express');
const AuthController = require("../controllers/auth/index.js")
const { body } = require("express-validator");
const RequestValidator = require('../middlewares/request-validator.js');

const router = express.Router()


router.post('/register', AuthController.signup)
router.post('/login', AuthController.login)
// router.post(
//     "/auth/forgot-password",
//     [body("email").isEmail().withMessage("provide valid email address")],
//     RequestValidator,
//     AuthController.forgotPassword
//   )
// router.post(
//     "/auth/reset-password",
//     [
//       body("email").isEmail().withMessage("provide a valid email address"),
//       body("newPassword")
//         .notEmpty()
//         .trim()
//         .withMessage("provide a valid password"),
//       body("confirmationCode")
//         .isAlphanumeric()
//         .trim()
//         .withMessage("provide a valid confirmation code"),
//     ],
//     RequestValidator,
//     AuthController.resetPassword
//   )


module.exports = router;