const AbstractController = require("../AbstractController.js")
// const User = require("../../models/usermodel.js")
const UserService = require("../../services/user/index.js")

class UserController extends AbstractController {
    constructor() {
      super()
    }

    static async getUsers(req, res) {
      try {
        const users = await UserService.getUsers();
  
        if (users) {
            AbstractController.successResponse(res, users, 200, "all users found")
        }
          
      } catch (error) {
        console.log(error)
        throw new AppError('Error getting all users');
      }
    }

    static async getUser(req, res) {
      try {
        const user = await UserService.getUser(req.params.id);
  
        if (user) {
          AbstractController.successResponse(res, user, 200, "user found")
        }
          
      } catch (error) {
        console.log(error)
        throw new AppError('Error getting user');
      }
    }

    static async updateUser(req, res) {
      try {
        const user = await UserService.updateUser(req.params.id, req.body);
  
        if (user) {
            AbstractController.successResponse(res, user, 200, "user updated")
        }
          
      } catch (error) {
        console.log(error)
        throw new AppError('Error updating user');
      }
    }

    static async deleteUser(req, res) {
      try {
        const user = await UserService.deleteUser(req.params.id);
  
        if (user) {
            AbstractController.successResponse(res, user, 200, "user deleted")
        }
          
      } catch (error) {
        console.log(error)
        throw new AppError('Error deleting user');
      }
    }

}


module.exports = UserController