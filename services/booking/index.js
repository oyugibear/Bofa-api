const AbstractService = require("../AbstractService.js")
const bookingModel = require("../../models/bookingModel.js")
const AppError = require("../../errors/app-error.js")

const timeToMinutes = (time = '') => {
  const [hours = '0', minutes = '0'] = String(time).split(':')
  return (Number(hours) * 60) + Number(minutes)
}

const durationToMinutes = (duration = 1) => {
  const hours = Number(duration) || 1
  return hours * 60
}

const isHeldBooking = (booking) => {
  const paymentStatus = booking.paymentInfo?.payment_status;
  const normalizedPaymentStatus = typeof paymentStatus === "string" ? paymentStatus.toLowerCase() : "";
  const normalizedBookingStatus = typeof booking.status === "string" ? booking.status.toLowerCase() : "";

  return (
    booking.payment_waived === true ||
    booking.booking_type === 'manager_scheduled_match' ||
    normalizedPaymentStatus === "completed" ||
    normalizedPaymentStatus === "paid" ||
    normalizedBookingStatus === "paid" ||
    normalizedBookingStatus === "completed"
  );
}

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

    static async hasBookingConflict({ date_requested, time, duration = '1', field, source_match }) {
      if (!date_requested || !time || !field) return false;

      const bookings = await bookingModel.find({
        date_requested,
        field,
        ...(source_match && { source_match: { $ne: source_match } })
      }).populate("paymentInfo");

      const start = timeToMinutes(time);
      const end = start + durationToMinutes(duration);

      return bookings.some((booking) => {
        if (!isHeldBooking(booking)) return false;

        const bookingStart = timeToMinutes(booking.time);
        const bookingEnd = bookingStart + durationToMinutes(booking.duration);

        return start < bookingEnd && end > bookingStart;
      });
    }

    static async createManagerMatchBooking({ match, field, date_requested, time, postedBy, team_name }) {
      if (!match || !field || !date_requested || !time) return null;

      const existingBooking = await bookingModel.findOne({ source_match: match._id });
      if (existingBooking) return existingBooking;

      const hasConflict = await BookingService.hasBookingConflict({
        date_requested,
        time,
        duration: '1',
        field,
        source_match: match._id
      });

      if (hasConflict) {
        throw new AppError("Selected field and time are already held by another booking", 409);
      }

      const booking = await AbstractService.createDocument(bookingModel, {
        date_requested,
        time,
        duration: '1',
        field,
        team_name,
        total_price: 0,
        status: 'completed',
        booking_type: 'manager_scheduled_match',
        payment_required: false,
        payment_waived: true,
        source_match: match._id,
        postedBy
      });

      return booking;
    }
    
    static async editBooking(data, id) {
      console.log("second")
      try {
        const booking = await AbstractService.editDocument(bookingModel, id, data)
        if(!booking) throw new AppError("could not edit the booking", 400)

        const populatedItem = await bookingModel.findById(booking._id).populate("postedBy paymentInfo")
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
        const populatedBookings = await bookingModel.populate(bookings, { path: "postedBy paymentInfo client field" });
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

        const populatedBooking = await bookingModel.populate(booking, { path: "postedBy paymentInfo client field" });
        return populatedBooking;
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get Booking", 400)
      }
    }
  
  }
  
  module.exports = BookingService
