const moongose = require('mongoose');

const teamSchema = new moongose.Schema({
    name: { type: String, required: true },
    members: [{ type: moongose.Types.ObjectId, ref: "User" }],
    league: { type: moongose.Types.ObjectId, ref: "League" },
    logo: { type: String, },
    coach: { type: moongose.Types.ObjectId, ref: "User" },
    captain: { type: moongose.Types.ObjectId, ref: "User" },
    achievements: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true }
    }],
    status: { type: String, default: 'inactive' },
    matches: [{ type: moongose.Types.ObjectId, ref: "Match" }],
    postedBy: { type: moongose.Types.ObjectId, ref: "User", required: true },
    editedBy: { type: moongose.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = moongose.model('Team', teamSchema);