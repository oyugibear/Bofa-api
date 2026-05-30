const mongoose = require('mongoose');

const teamInviteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    team: {
        type: mongoose.Types.ObjectId,
        ref: "Team",
        required: true
    },
    invitedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'expired'],
        default: 'pending'
    },
    expiresAt: {
        type: Date,
        required: true
    },
    acceptedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    acceptedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('TeamInvite', teamInviteSchema);
