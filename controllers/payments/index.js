const AbstractController = require("../AbstractController.js")
// const User = require("../../models/usermodel.js")
const PaymentService = require("../../services/Payments/index.js");
const AppError = require("../../errors/app-error.js");
const paymentModel = require("../../models/paymentModel.js");
const { createBooking } = require("../booking");
const BookingService = require("../../services/booking/index.js");
const bookingModel = require("../../models/bookingModel.js");
const axios = require('axios');
const { sendAdminBookingPaidEmail, sendBookingRecievedEmail, sendClientReceiptEmail } = require("../../util/Email/sendMail.js");
const { generateReceiptPdf } = require("../../util/PDF/index.js");
const { uploadToCloudinary } = require("../../util/Cloudinary/index.js");

class PaymentController extends AbstractController {
    constructor() {
        super()
    }

    static async createPayment(req, res) {
      try {
        let paymentData = req.body;
        const payment = await PaymentService.createPayment(paymentData);
        if (payment) {
          AbstractController.successResponse(res, payment, 200, "Payment Created")
        }
      
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Create Payment", 400)
      }
    }    
    
    static async confirmPaymentPaystack(req, res) {
      console.log("********** Reference", req.query.reference);
      console.log("********** Query Params", req.query);
      console.log("********** Body", req.body);
  
      try {
        // First, verify the payment with Paystack to ensure it's valid
        const headers = {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        };
        
        let paystackData;
        try {
          const response = await axios.get(`https://api.paystack.co/transaction/verify/${req.query.reference}`, { headers });
          if (response?.status !== 200) throw new Error("Couldn't verify payment");
          paystackData = response.data.data;
        } catch (error) {
          console.error("Paystack verification failed:", error.response?.data || error.message);
          throw new AppError("Payment verification failed with Paystack", 400);
        }

        // Try to find payment by reference
        let payment;
        let booking;
        
        try {
          payment = await PaymentService.getPaymentByReference(req.query.reference);
          booking = await bookingModel.findById(payment.booking_id).populate("postedBy");
        } catch (error) {
          // If payment not found, try to find it using Paystack metadata or create a fallback response
          console.log("Payment not found with reference, checking Paystack metadata...");
          
          // In a real implementation, you might:
          // 1. Check Paystack metadata for our internal reference
          // 2. Create a new payment record if none exists
          // 3. Return a generic success response for unknown payments
          
          // For now, return a generic success response
          console.log("Unknown payment reference:", req.query.reference);
          const callbackUrl = `https://africajipendewellness.com/sessions?payment=success&unknown=true`;
          return res.redirect(callbackUrl);
        }
        
        if (!booking) throw new AppError("Could not get Booking data", 400);

        const paymentData = {
          payment_method: "Online: " + paystackData.authorization.channel,
          payment_reference: req.query.reference,
          payment_date: paystackData.paid_at,
          payment_status: "paid",
          currency: paystackData.currency,
          notes: `Paystack Payment\n fees: ${paystackData.fees} \n gateway_response: ${paystackData.gateway_response}`,
        };


        const compiledData = {
          booking: booking,
          payment: payment,
          client: booking.postedBy,
        }

        // try {
        //   // const filename = await generateReceiptPdf(compiledData);
        //   const cloudinaryUrl = await uploadToCloudinary(filename, "Receipts");
  
        //   payment.receipt_pdf = cloudinaryUrl;
        //   payment.payment_status = "Completed";
        //   await payment.save();
        // } catch (error) {
        //   console.error("Error saving payment: ", error);
        //   throw new AppError("Internal Server Error", 500);
        // }
  
        // Send email to admin and client about the payment
        try {
          console.log("booking data: ", booking);
          const emailToAdmin = sendAdminBookingPaidEmail(booking.postedBy.email, booking, paymentData);
          const emailToUser = sendBookingRecievedEmail(booking.postedBy.email);
          const emailReceipt = sendClientReceiptEmail(booking.postedBy.email, payment);
          
          if(emailToAdmin){
            console.log("Email sent to admin")
          }
          if(emailToUser){
            console.log("Email sent to user")
          }
          if(emailReceipt){
            console.log("Email sent to client")
          }
        } catch (error) {
          console.error("Error sending emails: ", error);
        }

        const updatedPayment = await PaymentService.editPayment(paymentData, payment._id);
        if(!updatedPayment){
          console.log("Payment not updated")
        }

        // update payment status in booking
        booking.payment_status = "paid";
        booking.paymentInfo = payment._id;
        await booking.save();
  
        const env = process.env.NODE_ENV === "development";
        const confirmationUrl = `/account`;
        const callbackUrl = env
          ? `${process.env.DEV_CALLBACK_URL}${confirmationUrl}`
          : `${process.env.PROD_CALLBACK_URL}${confirmationUrl}`;
        // const callbackUrl = `http://localhost:3000${confirmationUrl}`
        // console.log("Payment confirmation callbackUrl: ", callbackUrl)
        res.redirect(callbackUrl);
      } catch (error) {
        console.error(error);
        throw new AppError("Internal Server Error Paystack Response", 500);
      }
    }

    static async getPayments(req, res) {
      try {
        const payments = await PaymentService.getPayments();
    
        if (payments) {
          AbstractController.successResponse(res, payments, 200, "all payments found")
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get Payments", 400)
      }
    }

    static async getPayment(req, res) {
      try {
        const payment = await PaymentService.getPayment(req.params.id);
    
        if (payment) {
          AbstractController.successResponse(res, payment, 200, "payment found")
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get Payment", 400)
      }
    }

    static async getPaymentByUser(req, res) {
      try {
        const payment = await PaymentService.getPaymentByUser(req.params.id);
    
        if (payment) {
          AbstractController.successResponse(res, payment, 200, "payment found")
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get Payment", 400)
      }
    }

    static async editPayment(req, res) {
      try {
        const payment = await PaymentService.editPayment(req.body, req.params.id);
    
        if (payment) {
          AbstractController.successResponse(res, payment, 200, "payment updated")
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Edit Payment", 400)
      }
    }
}

module.exports = PaymentController