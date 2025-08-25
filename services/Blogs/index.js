const AbstractService = require("../AbstractService.js")
const blogModel = require("../../models/blogsModel.js")
const AppError = require("../../errors/app-error.js")

class BlogsService extends AbstractService {
    constructor() {
      super()
    }

    static async createBlog(blog) {
        const newBlog = await AbstractService.createDocument(blogModel, blog)
        if(!newBlog) throw new AppError("could not create blog", 400)
        return newBlog
    }

    static async getBlogs() {
        const blogs = await AbstractService.getDocuments(blogModel)
        if(!blogs) throw new AppError("could not get all the blogs", 400)
        return blogs
    }

    static async getBlog(id) {
        const blog = await AbstractService.getSingleDocumentById(blogModel, id)
        return blog
    }


    static async updateBlog(id, data) {
        const blog = await AbstractService.editDocument(blogModel, id, data)
        if(!blog) throw new AppError("could not update the blog", 400)
        return blog
    }

    static async deleteBlog(id) {
        const blog = await blogModel.findByIdAndDelete(id)
        if(!blog) throw new AppError("could not delete the blog", 400)
        return blog
    }


  }
  
  module.exports = BlogsService