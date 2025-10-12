const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String },
    homeTeam: { type: mongoose.Types.ObjectId, ref: "Team", required: true },
    awayTeam: { type: mongoose.Types.ObjectId, ref: "Team", required: true },
    venue: { type: String, required: true },
    status: { type: String, default: 'pending' },
    score: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 }
    },
    highlights: { type: String },
    league: { type: mongoose.Types.ObjectId, ref: "League" },
    postedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    editedBy: { type: mongoose.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);