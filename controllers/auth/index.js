const AbstractController = require("../AbstractController.js")
const User = require("../../models/userModel.js")
const AuthService = require("../../services/Auth/index.js")
const { nanoid } = require("nanoid")
const bcrypt = require("bcryptjs")
const AppError = require("../../errors/app-error.js")
const UserService = require("../../services/user/index.js")
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const { sendWelcomeEmail, sendForgotEmail } = require("../../util/Email/sendMail.js")

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

    static async forgotPassword(req, res) {
      try {
        const { email } = req.body;
        
        // Validate input
        if (!email) {
          return res.status(400).json({ 
            status: false,
            error: 'Email is required' 
          });
        }

        // Generate 6-digit reset code
        const shortCode = nanoid(6).toUpperCase();
        
        // Find user and update with reset code
        const user = await User.findOneAndUpdate(
          { email },
          { passwordResetCode: shortCode },
          { new: true }
        );
        
        if (!user) {
          return res.status(400).json({
            status: false,
            error: "No account found with that email address"
          });
        }
        
        // Send reset email
        try {
          await sendForgotEmail(shortCode, email);
          
          return res.status(200).json({
            status: true,
            message: "Reset code sent to your email",
            data: { email }
          });
        } catch (emailError) {
          console.error('Failed to send reset email:', emailError);
          return res.status(500).json({
            status: false,
            error: "Failed to send reset email. Please try again."
          });
        }
            
      } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
          status: false,
          error: "Internal server error. Please try again."
        });
      }
    }

    static async resetPassword(req, res) {
      try {
        const { email, confirmationCode, newPassword } = req.body;
        
        // Validate input
        if (!email || !confirmationCode || !newPassword) {
          return res.status(400).json({
            status: false,
            error: "Email, confirmation code, and new password are required"
          });
        }

        if (newPassword.length < 6) {
          return res.status(400).json({
            status: false,
            error: "Password must be at least 6 characters long"
          });
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        
        // Find user with matching email and reset code, then update password
        const user = await User.findOneAndUpdate(
          { 
            email, 
            passwordResetCode: confirmationCode.toUpperCase() 
          },
          { 
            password: hashedPassword, 
            passwordResetCode: "" // Clear the reset code after use
          },
          { new: true }
        ).exec();
        
        if (!user) {
          return res.status(400).json({
            status: false,
            error: "Invalid email or confirmation code"
          });
        }
        
        return res.status(200).json({
          status: true,
          message: "Password reset successfully",
          data: { email }
        });
        
      } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
          status: false,
          error: "Internal server error. Please try again."
        });
      }
    }

}


module.exports = AuthController