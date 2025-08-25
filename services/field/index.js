const AbstractService = require("../AbstractService.js")
const fieldModel = require("../../models/fieldModel.js")
const AppError = require("../../errors/app-error.js")

class FieldService extends AbstractService {
    constructor() {
      super()
    }

    static async createField(data) {

      const field = await AbstractService.createDocument(fieldModel, data)
      if(!field) throw new AppError("could not create the new field", 400)

      return field
    }

    static async getFields() {
      const field = await AbstractService.getDocuments(fieldModel)
      // console.log(field)
      if(!field) throw new AppError("could not get all the field data", 400)
  
      return field
    }

    static async getField(id) {
      const field = await AbstractService.getSingleDocumentById(fieldModel, id)
      return field; // Return null if not found, don't throw error
    }

    static async updateField(id, data) {
      const field = await AbstractService.editDocument(fieldModel, id, data)
      if(!field) throw new AppError("could not update the field data", 400)

      return field
    }

    static async deleteField(id) {
      const field = await fieldModel.findByIdAndDelete(id)
      if(!field) throw new AppError("could not delete the field data", 400)

      return field
    }

    // Get available fields for booking
    static async getAvailableFields(query, date, startTime, endTime) {
      // This would need more complex logic to check for booking conflicts
      // For now, just return fields that match the basic criteria
      const fields = await fieldModel.find(query).populate('postedBy', 'first_name second_name email');
      return fields;
    }

    // Get fields by type
    static async getFieldsByType(fieldType) {
      const fields = await fieldModel.find({ 
        fieldType, 
        status: 'active', 
        isAvailable: true 
      }).populate('postedBy', 'first_name second_name email');
      
      return fields;
    }

    // Get popular fields
    static async getPopularFields() {
      const fields = await fieldModel.find({ status: 'active' })
        .sort({ 'statistics.totalBookings': -1 })
        .limit(10)
        .populate('postedBy', 'first_name second_name email');
      
      return fields;
    }

    // Update field statistics
    static async updateStatistics(id, bookingAmount) {
      const field = await fieldModel.findById(id);
      if (!field) throw new AppError("Field not found", 404);

      const updatedField = await field.updateStatistics(bookingAmount);
      return updatedField;
    }

    // Add maintenance record
    static async addMaintenanceRecord(id, description, cost, performedBy) {
      const field = await fieldModel.findById(id);
      if (!field) throw new AppError("Field not found", 404);

      const updatedField = await field.addMaintenanceRecord(description, cost, performedBy);
      return updatedField;
    }
    
  
  }
  
  module.exports = FieldService