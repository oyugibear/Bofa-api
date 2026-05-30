const AbstractController = require("../AbstractController.js")
const User = require("../../models/userModel.js")
const AuthService = require("../../services/Auth/index.js")
const { nanoid } = require("nanoid")
const bcrypt = require("bcryptjs")
const AppError = require("../../errors/app-error.js")
const UserService = require("../../services/user/index.js")
const teamModel = require("../../models/teamModel.js")
const teamInviteModel = require("../../models/teamInviteModel.js")
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
        console.warn('🚀 Registration attempt started')
        console.warn('📤 Request body:', req.body)
        
        const { email, first_name, second_name, phone_number, date_of_birth, password, teamInviteToken } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!first_name) missingFields.push('first_name');
        if (!second_name) missingFields.push('second_name');
        if (!email) missingFields.push('email');
        if (!phone_number) missingFields.push('phone_number');
        if (!date_of_birth) missingFields.push('date_of_birth');
        if (!password) missingFields.push('password');
        
        if (missingFields.length > 0) {
          console.warn('❌ Missing required fields:', missingFields)
          return res.status(400).json({
            status: false,
            error: `Missing required fields: ${missingFields.join(', ')}`
          });
        }

        console.warn('✅ All required fields present')

        // Check if the email already exists in the database
        const existingUser = await UserService.findByEmail(email);
        if (existingUser) {
          console.warn('❌ Email already registered:', email)
          return res.status(400).json({
            status: false,
            error: "Email Already Registered"
          });
        }

        console.warn('✅ Email is available:', email)

        // If the email doesn't exist, proceed with the signup process
        console.warn('🔄 Creating user account...')
        let invite = null;
        if (teamInviteToken) {
          invite = await teamInviteModel.findOne({
            token: teamInviteToken,
            status: 'pending',
            expiresAt: { $gt: new Date() }
          });

          if (!invite) {
            return res.status(400).json({
              status: false,
              error: "This team invitation is invalid or has expired"
            });
          }

          if (invite.email.toLowerCase() !== email.toLowerCase()) {
            return res.status(400).json({
              status: false,
              error: "This invitation was sent to a different email address"
            });
          }
        }

        const userPayload = {
          ...req.body,
          ...(invite && { team_id: invite.team })
        };

        let user = await AuthService.signup(userPayload);

        if (invite) {
          await teamModel.findByIdAndUpdate(invite.team, { $addToSet: { members: user._id } });
          invite.status = 'accepted';
          invite.acceptedBy = user._id;
          invite.acceptedAt = new Date();
          await invite.save();
        }

        user.password = undefined;

        console.warn('✅ User created successfully:', user._id)

        // Send welcome email
        try {
          const emailResponse = await sendWelcomeEmail(email);
          console.warn("📧 Welcome email sent:", emailResponse);
        } catch (error) {
          console.warn("⚠️ Error sending welcome email:", error.message);
        }
        
        console.warn('✅ Registration completed successfully for:', email)
        return res.status(201).json({
          status: true,
          message: "Signup successful",
          data: user
        });
        
      } catch (error) {
        console.warn("🚨 Signup error occurred:", error);
        console.warn("🚨 Error details:", {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        
        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(err => err.message);
          console.warn("❌ Validation errors:", validationErrors);
          return res.status(400).json({
            status: false,
            error: `Validation failed: ${validationErrors.join(', ')}`
          });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
          console.warn("❌ Duplicate key error for email");
          return res.status(400).json({
            status: false,
            error: "Email already exists"
          });
        }
        
        console.warn("❌ Unexpected error during registration");
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

    static async changePassword(req, res) {
      try {
        const { currentPassword, newPassword } = req.body;

        if (!req.user?._id) {
          return res.status(401).json({
            status: false,
            error: "Authentication required"
          });
        }

        if (!currentPassword || !newPassword) {
          return res.status(400).json({
            status: false,
            error: "Current password and new password are required"
          });
        }

        if (newPassword.length < 6) {
          return res.status(400).json({
            status: false,
            error: "Password must be at least 6 characters long"
          });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
          return res.status(404).json({
            status: false,
            error: "User not found"
          });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
          return res.status(400).json({
            status: false,
            error: "Current password is incorrect"
          });
        }

        user.password = await bcrypt.hash(newPassword, 8);
        await user.save();

        return res.status(200).json({
          status: true,
          message: "Password changed successfully"
        });
      } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({
          status: false,
          error: "Internal server error. Please try again."
        });
      }
    }

}


module.exports = AuthController
