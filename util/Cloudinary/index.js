const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, location) => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `'Jipende/${location}`, // Optional: specify the folder in Cloudinary where the image will be stored
        timeout: 6000000, // Increase timeout to 60 seconds
        use_filename: true,
      });

      console.log('Image uploaded to Cloudinary:', result.url);

      return result.secure_url; // Return the Cloudinary URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      attempts++;
      if (attempts === maxAttempts) {
        console.error('Failed to upload to Cloudinary after ' + maxAttempts + ' attempts');
        throw error;
      } else {
        console.log('Retrying upload to Cloudinary...');
      }
    }
  }
};

module.exports = { cloudinary, uploadToCloudinary };