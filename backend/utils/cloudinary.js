const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); //This is a special storage engine for multer that:Saves files directly to Cloudinary
const multer = require('multer'); //multer is a middleware used to handle multipart/form-data (file uploads) in Express and It will parse the uploaded file before it hits your route handler

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'book-covers', // Folder name in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 300, height: 440, crop: 'fill' }],
  },
});

const upload = multer({ storage });
/*Creates an upload middleware — when used in a route, it will:
Accept a file
Resize it
Upload it directly to Cloudinary
Attach the resulting url and public_id to the req.file object*/

module.exports = { cloudinary, upload };
