const AbstractController = require('../AbstractController');
const MatchService = require('../../services/Match/index.js');
const AppError = require('../../errors/app-error');
const TeamService = require('../../services/Team/index.js');
const StandingsService = require('../../services/Standings/index.js');
const BookingService = require('../../services/booking/index.js');

const getTeamName = (team) => team?.name || String(team || '');

class MatchController extends AbstractController {
    constructor() {
        super();
    }

    static async createMatch(req, res) {
        try {
            const details = req.body; 
            const field = details.field || details.fieldId;
            const date = details.date || details.date_requested;
            const time = details.time;

            if (field && date && time) {
                const hasConflict = await BookingService.hasBookingConflict({
                    date_requested: date,
                    time,
                    duration: '1',
                    field
                });

                if (hasConflict) {
                    return res.status(409).json({
                        status: false,
                        message: 'Selected field and time are already held by another booking'
                    });
                }
            }

            const match = await MatchService.createMatch(details);
            console.log(match);

            // Add the matches to the teams
            let team1 = null;
            let team2 = null;
            try {
                team1 = await TeamService.getTeam(details.homeTeam);
                team2 = await TeamService.getTeam(details.awayTeam);
                await TeamService.updateTeam(team1._id, { $addToSet: { matches: match._id } });
                await TeamService.updateTeam(team2._id, { $addToSet: { matches: match._id } });
            } catch (error) {
                console.log("Error updating teams: ", error);
            }

            if (field && date && time) {
                try {
                    const booking = await BookingService.createManagerMatchBooking({
                        match,
                        field,
                        date_requested: date,
                        time,
                        postedBy: details.postedBy,
                        team_name: `${getTeamName(team1)} vs ${getTeamName(team2)}`
                    });

                    if (booking?._id) {
                        match.booking = booking._id;
                        match.field = field;
                        await match.save();
                    }
                } catch (bookingError) {
                    console.log("Error creating manager booking for match: ", bookingError);
                    throw bookingError;
                }
            }
            
            if (match) {
                AbstractController.successResponse(res, match, 200, 'Match Created');
            }

        } catch (error) {
            console.log(error);
            throw new AppError('Error creating match', 400);
        }
    }

    static async getMatches(req, res) {
        try {
            const matches = await MatchService.getMatches();
            AbstractController.successResponse(res, matches, 200, 'Matches fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting matches', 400);
        }
    }

    static async getMatchesByTeamId(req, res) {
        try {
            const matches = await MatchService.getMatches(req.params.id);
            const filteredMatches = matches.filter(match => {
                const homeTeamId = match.homeTeam?._id || match.homeTeam;
                const awayTeamId = match.awayTeam?._id || match.awayTeam;
                return homeTeamId?.toString() === req.params.id || awayTeamId?.toString() === req.params.id;
            });
            AbstractController.successResponse(res, filteredMatches, 200, 'Matches fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting matches by team ID', 400);
        }
    }

    static async getMatch(req, res) {
        try {
            const match = await MatchService.getMatch(req.params.id);
            AbstractController.successResponse(res, match, 200, 'Match fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting match', 400);
        }
    }

    static async updateMatch(req, res) {
        console.log("update match called", req.body);
        try {
            const id = req.params.id;
            const data = req.body;
            
            // Get the original match data for standings calculation
            const originalMatch = await MatchService.getMatch(id);
            const oldScore = originalMatch?.score;
            
            const match = await MatchService.updateMatch(id, data);
            // console.log(match);

            // Update standings if the match belongs to a league and has score changes
            if (match && match.league) {
                const hasScoreChange = data.score && 
                    (data.score.home !== undefined || data.score.away !== undefined);
                
                if (hasScoreChange) {
                    try {
                        console.log('Updating standings for match:', {
                            matchId: id,
                            leagueId: match.league,
                            oldScore,
                            newScore: match.score
                        });
                        
                        await StandingsService.updateStandingsForMatch(id, oldScore);
                        console.log('✅ Standings updated successfully for match:', id);
                    } catch (standingsError) {
                        console.error('❌ Error updating standings:', standingsError);
                        // Don't fail the match update if standings update fails
                        // but log it for debugging
                    }
                } else {
                    console.log('No score changes detected, skipping standings update');
                }
            } else {
                console.log('Match not associated with league, skipping standings update');
            }

            if (match) {
                AbstractController.successResponse(res, match, 200, 'Match updated successfully');
            }
        } catch (error) {
            console.log(error);
            throw new AppError('Error updating match', 400);
        }
    }

    static async deleteMatch(req, res) {
        try {
            const match = await MatchService.deleteMatch(req.params.id);
            AbstractController.successResponse(res, match, 200, 'Match deleted successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error deleting match', 400);
        }
    }

    static async confirmParticipation(req, res) {
        try {
            const userId = req.user?._id;
            const teamId = req.user?.team_id;
            const { status = 'confirmed' } = req.body;

            if (!userId || !teamId) {
                return res.status(403).json({
                    status: false,
                    message: 'You must belong to a team to confirm participation'
                });
            }

            if (!['confirmed', 'declined'].includes(status)) {
                return res.status(400).json({
                    status: false,
                    message: 'Participation status must be confirmed or declined'
                });
            }

            const match = await MatchService.getMatch(req.params.id);
            const homeTeamId = match.homeTeam?._id || match.homeTeam;
            const awayTeamId = match.awayTeam?._id || match.awayTeam;
            const userTeamId = teamId.toString();

            if (homeTeamId?.toString() !== userTeamId && awayTeamId?.toString() !== userTeamId) {
                return res.status(403).json({
                    status: false,
                    message: 'This match does not belong to your team'
                });
            }

            match.participants = (match.participants || []).filter((participant) => {
                const participantUserId = participant.user?._id || participant.user;
                return participantUserId?.toString() !== userId.toString();
            });
            match.participants.push({
                user: userId,
                team: teamId,
                status,
                confirmedAt: new Date()
            });

            await match.save();
            const populatedMatch = await MatchService.getMatch(match._id);
            AbstractController.successResponse(res, populatedMatch, 200, 'Participation updated successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error confirming participation', 400);
        }
    }

}

module.exports = MatchController;
