const AbstractController = require('../AbstractController.js');
const StandingsService = require('../../services/Standings/index.js');
const AppError = require('../../errors/app-error.js');

class StandingsController extends AbstractController {
    constructor() {
        super();
    }

    /**
     * Initialize standings for a league
     */
    static async initializeStandings(req, res) {
        try {
            const { leagueId } = req.params;
            
            if (!leagueId) {
                throw new AppError('League ID is required', 400);
            }

            const standings = await StandingsService.initializeStandings(leagueId);
            
            AbstractController.successResponse(
                res, 
                standings, 
                201, 
                'Standings initialized successfully'
            );
        } catch (error) {
            console.error('Error initializing standings:', error);
            throw new AppError('Failed to initialize standings', 400);
        }
    }

    /**
     * Get league standings
     */
    static async getStandings(req, res) {
        try {
            const { leagueId } = req.params;
            
            if (!leagueId) {
                throw new AppError('League ID is required', 400);
            }

            const standings = await StandingsService.getStandings(leagueId);
            
            AbstractController.successResponse(
                res, 
                standings, 
                200, 
                'Standings retrieved successfully'
            );
        } catch (error) {
            console.error('Error getting standings:', error);
            throw new AppError('Failed to get standings', 400);
        }
    }

    /**
     * Recalculate all standings for a league
     */
    static async recalculateStandings(req, res) {
        try {
            const { leagueId } = req.params;
            
            if (!leagueId) {
                throw new AppError('League ID is required', 400);
            }

            const standings = await StandingsService.recalculateStandings(leagueId);
            
            AbstractController.successResponse(
                res, 
                standings, 
                200, 
                'Standings recalculated successfully'
            );
        } catch (error) {
            console.error('Error recalculating standings:', error);
            throw new AppError('Failed to recalculate standings', 400);
        }
    }

    /**
     * Update standings for a specific match (internal use)
     */
    static async updateStandingsForMatch(req, res) {
        try {
            const { matchId } = req.params;
            const { oldScore } = req.body;
            
            if (!matchId) {
                throw new AppError('Match ID is required', 400);
            }

            const standings = await StandingsService.updateStandingsForMatch(matchId, oldScore);
            
            AbstractController.successResponse(
                res, 
                standings, 
                200, 
                'Standings updated successfully'
            );
        } catch (error) {
            console.error('Error updating standings for match:', error);
            throw new AppError('Failed to update standings', 400);
        }
    }
}

module.exports = StandingsController;
