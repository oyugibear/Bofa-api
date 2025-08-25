const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    services: {
        required: true,
        type: Array
    },
    booking_id: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: "Booking"
    },
    final_amount_invoiced: {
        required: true,
        type: Number,
    },
    amountPaid: {
        type: Number,
    },
    payment_method: {
        type: String,
    },
    payment_reference: {
        type: String,
    },
    payment_date: {
        type: String,
    },
    payment_status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    notes: {
        type: String,
    },
    vat: {
        type: Number,
    },
    paymentType: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    currency: {
        type: String,
    },
    paymentLink: {
        type: String,
    },
    receipt_pdf: {
        type: String,
    },
    postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    
},
{ timestamps: true }
)

module.exports = mongoose.model('Payment', paymentSchema)