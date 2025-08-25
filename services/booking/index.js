const AbstractService = require("../AbstractService.js")
const bookingModel = require("../../models/bookingModel.js")
const AppError = require("../../errors/app-error.js")

class BookingService extends AbstractService {
    constructor() {
      super()
    }

    static async createBooking(data) {
      try {
        const booking = await AbstractService.createDocument(bookingModel, data)
        if(!booking) throw new AppError("could not create the new booking", 400)
        const populatedItem = await bookingModel.findById(booking._id).populate("postedBy")
        
        return populatedItem
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Create Booking", 400)
      }

    }
    
    static async editBooking(data, id) {
      console.log("second")
      try {
        const booking = await AbstractService.editDocument(bookingModel, id, data)
        if(!booking) throw new AppError("could not edit the booking", 400)

        const populatedItem = await bookingModel.findById(booking._id).populate("postedBy paymentInfo therapist")
        console.log("Updated booking:", populatedItem)
        
        return {
          data: populatedItem
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Edit Booking", 400)
      }
    }

    static async getBookings() {
      try {
        const bookings = await AbstractService.getDocuments(bookingModel)
        if(!bookings) throw new AppError("could not get all the booking data", 400)
        const populatedBookings = await bookingModel.populate(bookings, { path: "postedBy paymentInfo client" });
        return populatedBookings;
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get Bookings", 400)
      }
    }
    
    static async getUserBookings(userId) {
      try {
        const bookings = await bookingModel.find({ client: userId });
        if(!bookings) throw new AppError("could not get the user's booking data", 400)
    
        return bookings
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get User Bookings", 400)
      }
    }

    static async getBooking(id) {
      try {
        const booking = await AbstractService.getSingleDocumentById(bookingModel, id)
        if(!booking) throw new AppError("could not get the booking data", 400)

        const populatedBooking = await bookingModel.populate(booking, { path: "postedBy paymentInfo client" });
        return populatedBooking;
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get Booking", 400)
      }
    }
  
  }
  
  module.exports = BookingService