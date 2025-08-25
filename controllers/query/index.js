const AbstractController = require('../AbstractController');
const QueryService = require('../../services/Queries');
const AppError = require('../../errors/app-error');

class QueryController extends AbstractController {
    constructor() {
        super();
    }

    static async createQuery(req, res) {
        try {
            const details = req.body;
            const query = await QueryService.createQuery(details);
            console.log(query);

            if (query) {
                const { data } = details;
                AbstractController.successResponse(res, data, 200, 'Query Created');
            }
        } catch (error) {
            console.log(error);
            throw new AppError('Error creating query', 400);
        }
    }

    static async getQueries(req, res) {
        try {
            const queries = await QueryService.getQueries();
            AbstractController.successResponse(res, queries, 200, 'Queries fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting queries', 400);
        }
    }

    static async getQuery(req, res) {
        try {
            const query = await QueryService.getQuery(req.params.id);
            AbstractController.successResponse(res, query, 200, 'Query fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting query', 400);
        }
    }

    static async updateQuery(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const query = await QueryService.updateQuery(id, data);
            console.log(query);

            if (query) {
                AbstractController.successResponse(res, query, 200, 'Query updated successfully');
            }
        } catch (error) {
            console.log(error);
            throw new AppError('Error updating query', 400);
        }
    }

    static async deleteQuery(req, res) {
        try {
            const id = req.params.id;
            const query = await QueryService.deleteQuery(id);
            console.log(query);

            if (query) {
                AbstractController.successResponse(res, query, 200, 'Query deleted successfully');
            }
        } catch (error) {
            console.log(error);
            throw new AppError('Error deleting query', 400);
        }
    }
}

module.exports = QueryController;