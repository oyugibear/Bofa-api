const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    season: { type: String, required: true },
    status: { type: String, enum: ['active', 'upcoming', 'finished'], default: 'upcoming' },
    numberOfTeams: { type: Number, default: 0 },
    teams: [{ type: mongoose.Types.ObjectId, ref: "Team" }],
    matches: [{ type: mongoose.Types.ObjectId, ref: "Match" }],
    prize: { type: String }, // For backward compatibility
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    prizePool: { type: Number, default: 0 },
    registrationFee: { type: Number, default: 0 },
    category: { type: String, required: true },
    level: { type: String, required: true },
    schedule: [{
        matchId: { type: mongoose.Types.ObjectId, ref: "Match" },
        date: { type: Date, required: true },
        time: { type: String, required: true }
    }],
    standings: [{
        teamId: { type: mongoose.Types.ObjectId, ref: "Team", required: true },
        position: { type: Number, default: 0 },
        matchesPlayed: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        goalsFor: { type: Number, default: 0 },
        goalsAgainst: { type: Number, default: 0 },
        goalDifference: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        form: [{ type: String, maxlength: 5 }], // Last 5 results: W/D/L
        lastUpdated: { type: Date, default: Date.now }
    }],
    isActive: { type: Boolean, default: true },
    // Audit fields
    postedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    edittedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    lastViewedBy: { type: mongoose.Types.ObjectId, ref: "User" },
},
{ timestamps: true }
);

module.exports = mongoose.model('League', leagueSchema);
