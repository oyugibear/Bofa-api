const moongose = require('mongoose');

const teamSchema = new moongose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: moongose.Types.ObjectId, ref: "User" }],
    league: { type: moongose.Types.ObjectId, ref: "League" },
    logo: { type: String, required: true },
    coach: { type: moongose.Types.ObjectId, ref: "User" },
    captain: { type: moongose.Types.ObjectId, ref: "User" },
    achievements: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true }
    }],
    postedBy: { type: moongose.Types.ObjectId, ref: "User", required: true },
    edittedBy: { type: moongose.Types.ObjectId, ref: "User", required: true }   
}, { timestamps: true });

module.exports = moongose.model('Team', teamSchema);