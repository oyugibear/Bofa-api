const AbstractService = require("../AbstractService.js")
const profileModel = require("../../models/leagueModel.js")
const AppError = require("../../errors/app-error.js")

class LeagueService extends AbstractService {
    constructor() {
      super()
    }

    static async createLeague(league) {
        try {
            const newLeague = await AbstractService.createDocument(leagueModel, league)
            if(!newLeague) throw new AppError("could not create league", 400)
            return newLeague
        } catch (error) {
            console.log(error)
            throw new AppError('Error creating league', 400);
        }
    }

    static async getLeagues() {
        try {
            const leagues = await AbstractService.getDocuments(leagueModel)
            if(!leagues) throw new AppError("could not get all the leagues", 400)
            return leagues
        } catch (error) {
            console.log(error)
            throw new AppError('Error getting all leagues', 400);
        }
    }

    static async getLeague(id) {
        try {
            const league = await AbstractService.getSingleDocumentById(leagueModel, id)
            if(!league) throw new AppError("could not get the league data", 400)
            return league
        } catch (error) {
            console.log(error)
            throw new AppError('Error getting league', 400);
        }
    }

    static async updateLeague(id, data) {
        try {
            const league = await AbstractService.editDocument(leagueModel, id, data)
            if(!league) throw new AppError("could not update the league data", 400)
            return league
        } catch (error) {
            console.log(error)
            throw new AppError('Error updating league', 400);
        }
    }

    static async deleteLeague(id) {
        try {
            const league = await AbstractService.deleteDocument(leagueModel, id)
            if(!league) throw new AppError("could not delete the league data", 400)
            return league
        } catch (error) {
            console.log(error)
            throw new AppError('Error deleting league', 400);
        }
    }

}

module.exports = LeagueService