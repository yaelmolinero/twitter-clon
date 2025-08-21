import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import config from './env';

cloudinary.config({
  cloud_name: 'twitter-images',
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

export {
  cloudinary,
  UploadApiResponse
};
