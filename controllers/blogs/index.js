const AbstractController = require("../AbstractController.js")
const BlogsService = require("../../services/Blogs/index.js")
const AppError = require("../../errors/app-error.js")

class BlogsController extends AbstractController {
    constructor() {
      super()
    }

    static async createBlog(req, res) {
      try {
        const file = req.file;
        let details = req.body;
        if (file) {
          details.picture = file.path; // The Cloudinary URL of the uploaded image
        }
        const blog = await BlogsService.createBlog(details)
        console.log(blog);
    
        if (blog) {
          const { data } = details
          AbstractController.successResponse(res, data, 200, "Service Created")
        }


      } catch (error) {
        console.log(error)
        throw new AppError('Error creating blog', 400);
      }
    }

    static async getBlogs(req, res) {
      try {
        const blogs = await BlogsService.getBlogs()
        AbstractController.successResponse(res, blogs, 200, "Blogs fetched successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error getting blogs', 400);
      }
    }

    static async getBlog(req, res) {
      try {
        const blog = await BlogsService.getBlog(req.params.id)
        AbstractController.successResponse(res, blog, 200, "Blog fetched successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error getting blog', 400);
      }
    }


    static async updateBlog(req, res) {
      try {
        const id = req.params.id
        const data = req.body
        const file = req.file;

        if (file) {
          data.picture = file.path; // The Cloudinary URL of the uploaded image
        }
        // console.log(data)
        const blog = await BlogsService.updateBlog(id, data)
    
        console.log("",blog)
        if (!blog) throw new AppError("could not approve the blog", 400)
        res.status(200).send(blog)
        
      } catch (error) {
        console.log(error)
        throw new AppError("Cannot Update blog", 400)
      }
    }

    static async deleteBlog(req, res) {
      try {
        const blog = await BlogsService.deleteBlog(req.params.id)
        AbstractController.successResponse(res, blog, 200, "Blog deleted successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error deleting blog', 400);
      }
    }


  }

module.exports = BlogsController
