const AbstractController = require("../AbstractController.js")
const User = require("../../models/userModel.js")
const AuthService = require("../../services/Auth/index.js")
// const { nanoid } = require("nanoid")
const bcrypt = require("bcryptjs")
const AppError = require("../../errors/app-error.js")
const UserService = require("../../services/user/index.js")
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const { sendWelcomeEmail } = require("../../util/Email/sendMail.js")

class AuthController extends AbstractController {
    constructor() {
      super()
    }

    static async signup(req, res) {
      try {
        const { email } = req.body;

        // Check if the email already exists in the database
        const existingUser = await UserService.findByEmail(email);
        if (existingUser) {
          return res.status(400).json({
            status: false,
            error: "Email Already Registered"
          });
        }

        // If the email doesn't exist, proceed with the signup process
        let user = await AuthService.signup(req.body);
        user.password = undefined;

        // Send welcome email
        try {
          const emailResponse = await sendWelcomeEmail(email);
          console.log("Welcome email sent:", emailResponse);
        } catch (error) {
          console.error("Error sending welcome email:", error);
        }
        
        return res.status(201).json({
          status: true,
          message: "Signup successful",
          data: user
        });
        
        console.log("SIGN UP SUCCESS");
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: false,
          error: error.message || "Internal Server Error"
        });
      }
    }

    static async login(req, res) {
      try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
          return res.status(400).json({ 
            status: false,
            error: 'Please provide email and password' 
          });
        }

        // Use AuthService for login
        const { user, token } = await AuthService.login({ email, password });
        
        // Remove password from response
        user.password = undefined;
        
        // Return success response
        return res.status(200).json({
          status: true,
          message: 'Login successful',
          user: user,
          token: token
        });
        
      } catch (error) {
        console.error(error);
        return res.status(400).json({ 
          status: false,
          error: error.message || 'Invalid email address or password' 
        });
      }
    }
    


    // static async forgotPassword(req, res) {
    //     try {
    //         const email = req.body.email
        
    //         const shortCode = nanoid(6).toUpperCase()
    //         const user = await User.findOneAndUpdate(
    //           { email },
    //           { passwordResetCode: shortCode }
    //         )
        
    //         if (!user) throw new AppError("provide a valid user email address", 400)
        
    //         const response = await AuthService.sendForgotPasswordEmail(
    //           shortCode,
    //           email
    //         )
    //         if (response) {
    //           AbstractController.successReponse(
    //             res,
    //             response,
    //             200,
    //             "Short code sent to your email"
    //           )
    //         }
            
    //     } catch (error) {
    //         console.log(error)
    //     }

    //   }

    // static async resetPassword(req, res) {
    //     try {
    //         const { email, confirmationCode, newPassword } = req.body
        
    //         const hashedPassword = await bcrypt.hash(newPassword, 8)
    //         const user = await User.findOneAndUpdate(
    //           { email, passwordResetCode: confirmationCode },
    //           { password: hashedPassword, passwordResetCode: "" }
    //         ).exec()
        
    //         if (!user) {
    //           throw new AppError("Check email/code and try again", 400)
    //         }
        
    //         res.json({ ok: true })
    //     } catch (error) {
    //         console.log(error)
    //     }
    //   }

}


module.exports = AuthController