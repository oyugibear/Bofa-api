const express = require('express');
const AuthController = require("../controllers/auth/index.js")
const { body } = require("express-validator");
const RequestValidator = require('../middlewares/request-validator.js');

const router = express.Router()


router.post('/register', AuthController.signup)
router.post('/login', AuthController.login)
router.post(
    "/forgot-password",
    [body("email").isEmail().withMessage("provide valid email address")],
    RequestValidator,
    AuthController.forgotPassword
  )
router.post(
    "/reset-password",
    [
      body("email").isEmail().withMessage("provide a valid email address"),
      body("newPassword")
        .isLength({ min: 6 })
        .trim()
        .withMessage("password must be at least 6 characters long"),
      body("confirmationCode")
        .isLength({ min: 6, max: 6 })
        .isAlphanumeric()
        .trim()
        .withMessage("provide a valid 6-digit confirmation code"),
    ],
    RequestValidator,
    AuthController.resetPassword
  )


module.exports = router;