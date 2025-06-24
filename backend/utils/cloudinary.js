const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

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
