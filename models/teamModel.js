const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    league: { type: mongoose.Types.ObjectId, ref: "League" },
    logo: { type: String, },
    coach: { type: mongoose.Types.ObjectId, ref: "User" },
    captain: { type: mongoose.Types.ObjectId, ref: "User" },
    achievements: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true }
    }],
    leagueHistory: [{
        league: { type: mongoose.Types.ObjectId, ref: "League" },
        position: { type: Number, required: true },
        points: { type: Number, required: true }
    }],
    status: { type: String, default: 'inactive' },
    matches: [{ type: mongoose.Types.ObjectId, ref: "Match" }],
    postedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    editedBy: { type: mongoose.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);