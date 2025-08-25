const mongoose = require('mongoose');

const queriesSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
    },
    phone_number: {
        required: true,
        type: String,
    },
    message: {
        required: true,
        type: Object,
    },
    status: {
        type: String,
        default: "Not Read"
    },
},
{ timestamps: true }
)

module.exports = mongoose.model('Queries', queriesSchema)