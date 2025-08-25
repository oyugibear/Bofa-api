const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    teams: [{ type: mongoose.Types.ObjectId, ref: "Team" }],
    matches: [{ type: mongoose.Types.ObjectId, ref: "Match" }],
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    schedule: [{
        matchId: { type: mongoose.Types.ObjectId, ref: "Match" },
        date: { type: Date, required: true },
        time: { type: String, required: true }
    }],
    standings: [{
        teamId: { type: mongoose.Types.ObjectId, ref: "Team" },
        points: { type: Number, default: 0 },
        matchesPlayed: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 }
    }],
    prize_pool: { type: Number, default: 0 },
    postedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    edittedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    lastViewedBy: { type: mongoose.Types.ObjectId, ref: "User" },
},
{ timestamps: true }
);

module.exports = mongoose.model('League', leagueSchema);
