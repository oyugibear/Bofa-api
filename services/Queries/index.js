const AbstractService = require("../AbstractService.js")
const queryModel = require("../../models/queryModel.js")
const AppError = require("../../errors/app-error.js")

class QueryService extends AbstractService {
    constructor() {
      super()
    }
  
    static async createQuery(query) {
        const newQuery = await AbstractService.createDocument(queryModel, query)
        if(!newQuery) throw new AppError("could not create query", 400)
        return newQuery
    }
  
    static async getQueries() {
        const queries = await AbstractService.getDocuments(queryModel)
        if(!queries) throw new AppError("could not get all the queries", 400)
        return queries
    }
  
    static async getQuery(id) {
        const query = await AbstractService.getSingleDocumentById(queryModel, id)
        return query
    }
  
    static async updateQuery(id, data) {
        const query = await AbstractService.editDocument(queryModel, id, data)
        if(!query) throw new AppError("could not update the query", 400)
        return query
    }
  
    static async deleteQuery(id) {
        const query = await queryModel.findByIdAndDelete(id)
        if(!query) throw new AppError("could not delete the query", 400)
        return query
    }
  
}

module.exports = QueryService