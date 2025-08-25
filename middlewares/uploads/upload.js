const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Ensure .env is loaded

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to create a multer instance with Cloudinary storage
const createUpload = (folderName) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        console.log("📂 Uploading file:", file); // Debug log
        return {
          folder: `Jipende/${folderName}`,
          format: file.mimetype.split("/")[1] || "jpeg",
          public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
        };
      },
    });
  
    const upload = multer({ storage }).single("file"); // Ensure file field is 'file'
  
    return (req, res, next) => {
      console.log("🛠 Processing Multer upload...");
      upload(req, res, (err) => {
        console.log("📤 Multer upload result:", req.file); // Log file data
        if (err) {
          console.error("❌ Multer error:", err);
          return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
          if (req.method === 'PUT') {
            console.log("🚫 No file received for PUT request.");
          } else {
            console.error("🚫 No file received.");
            return res.status(400).json({ error: "No picture received." });
          }
        }
        next();
      });
    };
  };
  

// Create different upload functions for different file paths
const uploadProfileImage = createUpload("profile_images");
const uploadServiceImage = createUpload("service_images");
const uploadBlogsImage = createUpload("blog_images");
const uploadDocument = createUpload("documents");

module.exports = {
  uploadProfileImage,
  uploadServiceImage,
  uploadDocument,
  uploadBlogsImage,
};
