const AbstractService = require("../AbstractService.js")
const paymentModel = require("../../models/paymentModel.js")
const AppError = require("../../errors/app-error.js")
const { sendBookingRecievedEmail } = require("../../util/Email/sendMail.js")
const userModel = require("../../models/userModel.js")

class PaymentService extends AbstractService {
    constructor() {
      super()
    }

    static async createPayment(data) {
      const payment = await AbstractService.createDocument(paymentModel, data)
      let user = data.postedBy;
      if (payment){
        const existingUser = await userModel.findOne({ _id: user });
        console.log("Email: ", existingUser?.email);
        // sendBookingRecievedEmail(existingUser?.email)
      }
      if(!payment) throw new AppError("could not create the new payment", 400)
      
      return payment
    }

    static async getPayments() {
      const payments = await AbstractService.getDocuments(paymentModel)
      if(!payments) throw new AppError("could not get all the payment data", 400)
      const populatedPayments = await paymentModel.populate(payments, { path: "postedBy booking_id" });
      return populatedPayments;
  
    }

    static async getPaymentByBooking(id) {
      const item = await paymentModel.findOne({ 
        booking_id: id 
      });
      if(!item) throw new AppError("could not get payment data", 400)

      const populatedItem = await paymentModel.findById(item._id).populate("booking_id").populate("postedBy");
      return populatedItem;
    }

    static async getPayment(id) {
      const item = await AbstractService.getSingleDocumentById(paymentModel, id)
      if(!item) throw new AppError("could not get payment data", 400)

      const populatedItem = await paymentModel.findById(item._id).populate("booking_id").populate("postedBy");
      return populatedItem;
    }

    static async editPayment(data, id) {
      try{
        const payment = await AbstractService.editDocument(paymentModel, id, data)
        if(!payment) throw new AppError("could not create the new payment", 400)
        console.log(payment)
        return payment
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Edit Payment", 400)
      }
    }

    static async getPaymentByUser(id) {
      const payments = await paymentModel.find({ postedBy: id });
      if(!payments) throw new AppError("could not get all the payment data", 400)
      const populatedPayments = await paymentModel.populate(payments, { path: "postedBy booking_id" });
      return populatedPayments;
    }

    static async getPaymentByReference(reference) {
      // Always search by payment_reference first, regardless of format
      let payment = await paymentModel.findOne({ 
        payment_reference: reference 
      });
      
      // If not found, and it's a valid ObjectId, also try searching by _id
      if (!payment) {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(reference)) {
          payment = await paymentModel.findById(reference);
        }
      }
      
      if(!payment) throw new AppError("could not find payment with this reference", 404)

      const populatedPayment = await paymentModel.findById(payment._id).populate("booking_id").populate("postedBy");
      return populatedPayment;
    }
}

module.exports = PaymentService