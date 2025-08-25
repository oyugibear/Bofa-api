const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    date_requested: {
        required: true,
        type: String
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    field: {
        type: mongoose.Types.ObjectId,
        ref: "Field"
    },
    team_name: {
        type: String,
    },
    client: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    total_price: {
        required: true,
        type: Number,
    },
    paymentInfo: {
        type: mongoose.Types.ObjectId, 
        ref: "Payment"
    },
    paymentLink: {
        type: String,
    },
    status: {
        type: String,
        default: "pending",
    },
    postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
},
{ timestamps: true }
)

module.exports = mongoose.model('Booking', bookingSchema)