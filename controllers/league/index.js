const AbstractController = require("../AbstractController.js")
const LeagueService = require("../../services/League/index.js")
const AppError = require("../../errors/app-error.js")
const userModel = require("../../models/userModel.js")
const userService = require("../../services/user/index.js")

class LeagueController extends AbstractController {
    constructor() {
      super()
    }

    static async createLeague(req, res) {
      try {
        const league = await LeagueService.createLeague(req.body)
        const user = league.postedBy;

        const userData = {
          profile_id: profile._id,
          profile_status: "Pending"
        }

        try {
          const updatedUser = await userService.updateUser(user, userData)
          if (!updatedUser) {
            throw new Error("Could not update user profile")
          }
        } catch (error) {
          console.log(error)
          throw new AppError('Error updating user profile', 400);          
        }

        AbstractController.successResponse(res, profile, 201, "Profile created successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error creating profile', 400);
      }
    }

    static async getLeagues(req, res) {
      try {
        const leagues = await LeagueService.getLeagues()
        AbstractController.successResponse(res, leagues, 200, "Leagues fetched successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error getting leagues', 400);
      }
    }

    static async getLeague(req, res) {
      try {
        const league = await LeagueService.getLeague(req.params.id)
        AbstractController.successResponse(res, league, 200, "League fetched successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error getting league', 400);
      }
    }

    static async updateLeague(req, res) {
      try {
        const league = await LeagueService.updateLeague(req.params.id, req.body)
        AbstractController.successResponse(res, league, 200, "League updated successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error updating league', 400);
      }
    }

    static async deleteLeague(req, res) {
      try {
        const league = await LeagueService.deleteLeague(req.params.id)
        AbstractController.successResponse(res, league, 200, "League deleted successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error deleting league', 400);
      }
    }
}

module.exports = LeagueController