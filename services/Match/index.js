const AbstractService = require("../AbstractService.js")
const matchModel = require("../../models/matchModel.js")
const AppError = require("../../errors/app-error.js")

class MatchService extends AbstractService {
    constructor() {
      super()
    }

    static async createMatch(match) {
        try {
            const newMatch = await AbstractService.createDocument(matchModel, match)
            if(!newMatch) throw new AppError("could not create match", 400)
            return newMatch
        } catch (error) {
            console.log(error)
            throw new AppError('Error creating match', 400);
        }
    }

    static async getMatches() {
        try {
            const matches = await AbstractService.getDocuments(matchModel)
            if(!matches) throw new AppError("could not get all the matches", 400)
            return matches
        } catch (error) {
            console.log(error)
            throw new AppError('Error getting all matches', 400);
        }
    }

    static async getMatch(id) {
        try {
            const match = await matchModel.findById(id)
            if(!match) throw new AppError("could not get the match data", 400)
            return match
        } catch (error) {
            console.log(error)
            throw new AppError('Error getting match', 400);
        }
    }

    static async updateMatch(id, data) {
        try {
            const match = await AbstractService.editDocument(matchModel, id, data)
            if(!match) throw new AppError("could not update the match data", 400)
            return match
        } catch (error) {
            console.log(error)
            throw new AppError('Error updating match', 400);
        }
    }

    static async deleteMatch(id) {
        try {
            const match = await AbstractService.deleteDocument(matchModel, id)
            if(!match) throw new AppError("could not delete the match data", 400)
            return match
        } catch (error) {
            console.log(error)
            throw new AppError('Error deleting match', 400);
        }
    }
}

module.exports = MatchService