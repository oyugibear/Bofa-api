const moongose = require('mongoose');

const matchSchema = new moongose.Schema({
    date: { type: String, required: true },
    time: { type: String },
    homeTeam: { type: moongose.Types.ObjectId, ref: "Team", required: true },
    awayTeam: { type: moongose.Types.ObjectId, ref: "Team", required: true },
    venue: { type: String, required: true },
    status: { type: String, default: 'pending' },
    score: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 }
    },
    highlights: { type: String },
    league: { type: moongose.Types.ObjectId, ref: "League" },
    postedBy: { type: moongose.Types.ObjectId, ref: "User", required: true },
    editedBy: { type: moongose.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = moongose.model('Match', matchSchema);