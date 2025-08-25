const AbstractService = require("../AbstractService.js")
const userModel = require("../../models/userModel.js")
const AppError = require("../../errors/app-error.js")

class UserService extends AbstractService {
    constructor() {
      super()
    }

    static async findByEmail(email) {
      try {
        const user = await userModel.findOne({ email });
        return user || null; // This can be null if no user is found
      } catch (error) {
        throw new AppError('Error finding user by email');
      }
    }
    
    static async getUsers() {
      try {
        const users = await AbstractService.getDocuments(userModel)
        if(!users) throw new AppError("could not get all the users data", 400)
        
        return users
      } catch (error) {
        console.log(error)
        throw new AppError('Error getting all users');
      }

    }

    static async getUser(id) {
      try {
        const user = await AbstractService.getSingleDocumentById(userModel, id)
        if(!user) throw new AppError("could not get the user data", 400)

        const populatedUser = await userModel.populate(user, { path: "profile" });  
        return populatedUser

      } catch (error) {
        console.log(error)
        throw new AppError('Error getting user');
      }

    }

    static async updateUser(id, data) {
      try {
        console.log("Updating user with ID:", id);
        console.log("Data to update:", data);
        const user = await AbstractService.editDocument(userModel, id, data);
        if (!user) throw new AppError("could not update the user data", 400);
        console.log("User updated:", user);
        return user
      } catch (error) {
        console.log(error)
        throw new AppError('Error updating user');
      }
    }

    static async deleteUser(id) {
      try {
        const user = await userModel.findByIdAndDelete(id)
        if(!user) throw new AppError("could not delete the user data", 400)
        return user
      } catch (error) {
        console.log(error)
        throw new AppError('Error deleting user');
      }
    }

  }
  
  module.exports = UserService