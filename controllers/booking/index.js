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
const { sendClientMeetingLinkEmail, sendClientRescheduleMeetingLinkEmail } = require("../../util/Email/sendMail.js");

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