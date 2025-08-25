const AbstractController = require("../AbstractController.js")
// const User = require("../../models/usermodel.js")
const FieldService = require("../../services/field/index.js");
const AppError = require("../../errors/app-error.js");

class FieldController extends AbstractController {
    constructor() {
      super()
    }

    static async createField(req, res) {
      try {
        let data = req.body;
        console.log("req", req.file)

        const file = req.file;

        if (file) {
          data.picture = file.path; // The Cloudinary URL of the uploaded image
        }

        const field = await FieldService.createField(data);
        console.log(field);
    
        if (field) {
          const { data } = field
          AbstractController.successResponse(res, data, 200, "field Created")
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Create field", 400)
      }
    }

    static async getFields(req, res) {
      try {
        const items = await FieldService.getFields();

        if (items) {
          AbstractController.successResponse(res, items, 200, "all items found")
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Get items", 400)
      }
    }

    static async getField(req, res) {
      try {
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({
            status: false,
            error: "Invalid field ID format"
          });
        }

        const field = await FieldService.getField(id);

        if (!field) {
          return res.status(404).json({
            status: false,
            error: "field not found"
          });
        }
        
        AbstractController.successResponse(res, field, 200, "field fetched successfully");
      } catch (error) {
        console.log(error);
        
        // Handle specific error types
        if (error.name === 'CastError') {
          return res.status(400).json({
            status: false,
            error: "Invalid field ID format"
          });
        }
        
        return res.status(500).json({
          status: false,
          error: error.message || "Cannot Get field"
        });
      }
    }

    static async deleteField(req, res) {
      try {
        const id = req.params.id
        const field = await FieldService.deleteField(id)

        if (field) {
          AbstractController.successResponse(res, field, 200, "field Deleted")
        }
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Delete field", 400)
      }
    }

    static async updateField(req, res) {
      try {
        const id = req.params.id
        const data = req.body
        const file = req.file;

        if (file) {
          data.picture = file.path; // The Cloudinary URL of the uploaded image
        }
        // console.log(data)
        const field = await FieldService.updateItem(id, data)

        console.log("",field)
        if (!field) throw new AppError("could not approve the field", 400)
        res.status(200).send(field)
        
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Update field", 400)
      }
    }

}


module.exports = FieldController