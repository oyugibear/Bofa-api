const e = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        required: true,
        type: String
    },
    second_name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    phone_number: {
        required: true,
        type: String,
    },
    date_of_birth: {
        required: true,
        type: String,
    },
    passwordResetCode: {
        type: String,
    },
    password: { type: String, required: true },
    role: {
        required: true,
        type: String,
        enum: ['Client', 'Coach', 'Admin'],
        default: 'Client'
    },
    team_id: {
        type: mongoose.Types.ObjectId,
        ref: "Team"
    },
    profile_status: {
        type: String,
        enum: ['Pending', 'Completed'],
    },
    therapy_notes: {
        type: Array,
        default: [
            {
                note: '',
                createdAt: new Date(),
                postedBy: {
                    type: mongoose.Types.ObjectId,
                    ref: 'User'
                }
            }
        ]
    }

},
{ timestamps: true }
)

module.exports = mongoose.model('User', userSchema)