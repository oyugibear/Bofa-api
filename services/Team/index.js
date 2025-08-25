const AbstractService = require("../AbstractService.js")
const teamModel = require("../../models/teamModel.js")
const AppError = require("../../errors/app-error.js")

class TeamService extends AbstractService {
    constructor() {
      super()
    }

    static async createTeam(team) {
        try {
            const newTeam = await AbstractService.createDocument(teamModel, team)
            if(!newTeam) throw new AppError("could not create team", 400)
            return newTeam
        } catch (error) {
            console.log(error)
            throw new AppError('Error creating team', 400);
        }
    }

    static async getTeams() {
        try {
            const teams = await AbstractService.getDocuments(teamModel)
            if(!teams) throw new AppError("could not get all the teams", 400)
            return teams
        } catch (error) {
            console.log(error)
            throw new AppError('Error getting all teams', 400);
        }
    }

    static async getTeam(id) {
        try {
            const team = await AbstractService.getSingleDocumentById(teamModel, id)
            if(!team) throw new AppError("could not get the team data", 400)
            return team
        } catch (error) {
            console.log(error)
            throw new AppError('Error getting team', 400);
        }
    }

    static async updateTeam(id, data) {
        try {
            const team = await AbstractService.editDocument(teamModel, id, data)
            if(!team) throw new AppError("could not update the team data", 400)
            return team
        } catch (error) {
            console.log(error)
            throw new AppError('Error updating team', 400);
        }
    }

    static async deleteTeam(id) {
        try {
            const team = await AbstractService.deleteDocument(teamModel, id)
            if(!team) throw new AppError("could not delete the team data", 400)
            return team
        } catch (error) {
            console.log(error)
            throw new AppError('Error deleting team', 400);
        }
    }
}

module.exports = TeamService