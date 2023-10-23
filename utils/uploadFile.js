const cloudinary = require('cloudinary').v2;
require('dotenv').config()
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'jpeg'],
    params: {
        folder: 'socialhive-api',
        transformation: [{ width: 500, heigth: 500, crop: "limit" }]
    },

});

module.exports = storage