const AbstractController = require('../AbstractController');
const TeamService = require('../../services/Team');
const AppError = require('../../errors/app-error');

class TeamController extends AbstractController {
    constructor() {
        super();
    }

    static async createTeam(req, res) {
        try {
            const details = req.body;
            const team = await TeamService.createTeam(details);
            console.log(team);

            if (team) {
                const { data } = details;
                AbstractController.successResponse(res, data, 200, 'Team Created');
            }
        } catch (error) {
            console.log(error);
            throw new AppError('Error creating team', 400);
        }
    }

    static async getTeams(req, res) {
        try {
            const teams = await TeamService.getTeams();
            AbstractController.successResponse(res, teams, 200, 'Teams fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting teams', 400);
        }
    }

    static async getTeam(req, res) {
        try {
            const team = await TeamService.getTeam(req.params.id);
            AbstractController.successResponse(res, team, 200, 'Team fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting team', 400);
        }
    }
    
    static async updateTeam(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const team = await TeamService.updateTeam(id, data);
            console.log(team);

            if (team) {
                AbstractController.successResponse(res, team, 200, 'Team updated successfully');
            }
        } catch (error) {
            console.log(error);
            throw new AppError('Error updating team', 400);
        }
    }

    static async deleteTeam(req, res) {
        try {
            const team = await TeamService.deleteTeam(req.params.id);
            AbstractController.successResponse(res, team, 200, 'Team deleted successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error deleting team', 400);
        }
    }

}

module.exports = TeamController;
