const AbstractController = require("../AbstractController.js")
// const User = require("../../models/usermodel.js")
const BookingService = require("../../services/booking/index.js");
const AppError = require("../../errors/app-error.js");
const bookingModel = require("../../models/bookingModel.js");
const userModel = require("../../models/userModel.js");
const axios = require('axios')
const { createPaymentLink } = require("../../util/Paystack/index.js");
const PaymentService = require("../../services/Payments/index.js");
const UserService = require("../../services/user/index.js");
const { sendClientMeetingLinkEmail, sendClientRescheduleMeetingLinkEmail, sendAdminBookingConfirmationEmail } = require("../../util/Email/sendMail.js");

class BookingController extends AbstractController {
    constructor() {
      super()
    }

    static async createBooking(req, res) {
      try {
        // Add the authenticated user to the booking data
        const bookingData = {
          ...req.body,
          postedBy: req.user._id
        };
        
        const booking = await BookingService.createBooking(bookingData);
        const paymentData = {
          booking_id: booking._id,
          services: booking,
          final_amount_invoiced: req.body.total_price,
          // vat: req.body.vat,
          paymentType: "Paystack",
          paymentStatus: "Pending",
          postedBy: req.user,
          paymentLink: '',
        }
        const payment = await PaymentService.createPayment(paymentData);
        
        // Add payment ID to paymentData for payment link creation
        paymentData.payment_id = payment._id;

        if (booking) {
          const paymentLink = await createPaymentLink(paymentData);
          
          // Update the booking document
          booking.paymentInfo = payment._id; // Store only the payment ID, not the full object
          booking.paymentLink = paymentLink;
          await booking.save();
          
          // Create a clean response object without circular references
          const responseData = {
            _id: booking._id,
            services: booking.services,
            postedBy: {
              _id: booking.postedBy._id,
              first_name: booking.postedBy.first_name,
              second_name: booking.postedBy.second_name,
              email: booking.postedBy.email,
              phone_number: booking.postedBy.phone_number
            },
            paymentInfo: {
              _id: payment._id,
              final_amount_invoiced: payment.final_amount_invoiced,
              // vat: payment.vat,
              paymentType: payment.paymentType,
              paymentStatus: payment.paymentStatus
            },
            paymentLink: paymentLink,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
          };
          
          AbstractController.successResponse(res, responseData, 200, "Booking Created");
        }
      } catch (error) {
        console.log(error);
        throw new AppError("Cannot Create Booking", 400);
      }
    }

    // Admin-only booking creation endpoint
    static async createAdminBooking(req, res) {
      try {
        let clientData = null;
        let isNewUser = false;
        
        // Handle client - either find existing or create new
        if (req.body.client && req.body.client.includes('@')) {
          // Client provided as email (new customer case)
          clientData = await UserService.getUserByEmail(req.body.client);
          
          // If user doesn't exist, create a basic user record
          if (!clientData) {
            const newUserData = {
              first_name: req.body.firstName || 'New',
              second_name: req.body.lastName || 'Customer',
              email: req.body.client,
              phone_number: req.body.phoneNumber || '',
              date_of_birth: new Date().toISOString().split('T')[0],
              role: 'Client',
              profile_status: 'Pending',
              password: 'Temporary@123'
            };
            
            clientData = await UserService.createUser(newUserData);
            isNewUser = true; // Mark as new user
          }
        } else {
          // Client provided as ID (existing customer)
          clientData = await UserService.getUser(req.body.client);
        }

        if (!clientData) {
          throw new AppError("Client not found or could not be created", 400);
        }

        // Prepare booking data with admin as creator
        const bookingData = {
          date_requested: req.body.date_requested,
          time: req.body.time,
          duration: req.body.duration,
          field: req.body.field,
          team_name: req.body.teamName || '',
          client: clientData._id,
          total_price: req.body.total_price,
          amount: req.body.total_price,
          status: req.body.status || 'confirmed', // Admin bookings default to confirmed
          payment_status: req.body.payment_status || 'pending',
          postedBy: req.user._id // Admin who created it
        };

        const booking = await BookingService.createBooking(bookingData);

        if (booking) {
          // Create payment record and payment link for admin bookings
          const paymentData = {
            booking_id: booking._id,
            services: booking,
            final_amount_invoiced: req.body.total_price,
            paymentType: "Paystack",
            paymentStatus: req.body.payment_status || "Pending",
            postedBy: req.user,
            paymentLink: '',
          }
          
          const payment = await PaymentService.createPayment(paymentData);
          
          // Add payment ID to paymentData for payment link creation
          paymentData.payment_id = payment._id;

          // Create payment link
          const paymentLink = await createPaymentLink(paymentData);
          
          // Update the booking document with payment info
          booking.paymentInfo = payment._id;
          booking.paymentLink = paymentLink;
          await booking.save();

          // Populate the booking with related data
          const populatedBooking = await bookingModel.findById(booking._id)
            .populate('client', 'first_name second_name email phone_number')
            .populate('field', 'name price_per_hour')
            .populate('postedBy', 'first_name second_name email')
            .populate('paymentInfo');

          // Send confirmation email with payment link and login instructions
          try {
            await sendAdminBookingConfirmationEmail(
              populatedBooking.client.email, 
              populatedBooking, 
              populatedBooking.client,
              isNewUser
            );
            console.log('Booking confirmation email sent successfully');
          } catch (emailError) {
            console.error('Failed to send booking confirmation email:', emailError);
            // Don't fail the booking creation if email fails
          }

          AbstractController.successResponse(res, populatedBooking, 201, "Admin booking created successfully");
        }
      } catch (error) {
        console.log('Admin booking creation error:', error);
        throw new AppError(error.message || "Cannot create admin booking", 400);
      }
    }

    static async getBookings(req, res) {
      try {
        const bookings = await BookingService.getBookings();
    
        if (bookings) {
          AbstractController.successResponse(res, bookings, 200, "all bookings found")
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get Bookings", 400)
      }
    }

    static async getAvailability(req, res) {
      try {
        const bookings = await BookingService.getBookings();
        const data = { 
          bookedSlots: bookings.map(b => ({ 
            date: b.date_requested, 
            time: b.time, 
            duration: b.duration,
            field: b.field,
            status: b.status
          })),
        }
        if (bookings) {
          AbstractController.successResponse(res, data, 200, "Availability fetched successfully")
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get Availability", 400)
      }
    }

    static async getUserBookings(req, res) {
      try {
        const userId = req.params.id;
        
        // Validate ObjectId format
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({
            status: false,
            error: "Invalid user ID format"
          });
        }
        
        // Check if user is accessing their own bookings or if they're an admin
        if (req.user._id.toString() !== userId && req.user.role !== 'Admin') {
          return res.status(403).json({
            status: false,
            message: 'Access denied - you can only view your own bookings'
          });
        }
        
        const bookings = await BookingService.getUserBookings(userId);
    
        if (bookings) {
            AbstractController.successResponse(res, bookings, 200, "User bookings found")
        } else {
            return res.status(404).json({
              status: false,
              error: "No bookings found for this user"
            });
        }
      } catch (error) {
        console.log(error);
        
        // Handle specific error types
        if (error.name === 'CastError') {
          return res.status(400).json({
            status: false,
            error: "Invalid user ID format"
          });
        }
        
        return res.status(500).json({
          status: false,
          error: error.message || "Cannot Get Bookings"
        });
      }
    }

    static async getBooking(req, res) {
      try {
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({
            status: false,
            error: "Invalid booking ID format"
          });
        }
        
        const booking = await bookingModel.findById(id).populate('postedBy');

        if (!booking) {
          return res.status(404).json({
            status: false,
            error: "Booking not found"
          });
        }

        // Check if user is accessing their own booking or if they're an admin
        if (req.user._id.toString() !== booking.postedBy._id.toString() && req.user.role !== 'Admin') {
          return res.status(403).json({
            status: false,
            message: 'Access denied - you can only view your own bookings'
          });
        }
    
        console.log("Found booking:", booking);
        res.status(200).json({
          status: true,
          data: booking,
          message: "Booking fetched successfully"
        });
        
      } catch (error) {
        console.log(error);
        
        // Handle specific error types
        if (error.name === 'CastError') {
          return res.status(400).json({
            status: false,
            error: "Invalid booking ID format"
          });
        }
        
        return res.status(500).json({
          status: false,
          error: error.message || "Cannot Get booking"
        });
      }
    }

    static async editBooking(req, res) {
      try {
        const id = req.params.id;
        const data = req.body;

        // Check if user is authorized to edit this booking
        const booking = await BookingService.getBooking(id);
        if (!booking) {
           throw new AppError("Booking not found", 404);
        }

        const updatedBooking = await BookingService.editBooking(data, id);

        AbstractController.successResponse(res, updatedBooking, 200, "Booking Updated Successfully");

      } catch (error) {
        console.log(error);
        throw new AppError("Cannot Get Bookings", 400)
      }
    }

}


module.exports = BookingController