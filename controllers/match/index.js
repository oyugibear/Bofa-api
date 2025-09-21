const AbstractController = require('../AbstractController');
const MatchService = require('../../services/Match/index.js');
const AppError = require('../../errors/app-error');
const TeamService = require('../../services/Team/index.js');

class MatchController extends AbstractController {
    constructor() {
        super();
    }

    static async createMatch(req, res) {
        try {
            const details = req.body; 
            const match = await MatchService.createMatch(details);
            console.log(match);

            // Add the matches to the teams
            try {
                const team1 = await TeamService.getTeam(details.homeTeam);
                const team2 = await TeamService.getTeam(details.awayTeam);
                TeamService.updateTeam(team1._id, { $push: { matches: match._id } });
                TeamService.updateTeam(team2._id, { $push: { matches: match._id } });
            } catch (error) {
                console.log("Error updating teams: ", error);
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
            const filteredMatches = matches.filter(match => match.teamId === req.params.id);
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
            const match = await MatchService.updateMatch(id, data);
            console.log(match);

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

}

module.exports = MatchController;
