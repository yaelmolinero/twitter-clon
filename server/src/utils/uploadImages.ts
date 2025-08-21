import sharp from 'sharp';
import { cloudinary, type UploadApiResponse } from '../config/cloudinary';

type FolderTypes = 'tweets' | 'avatars' | 'covers';

type UploadParams = { folder: FolderTypes, file: Express.Multer.File };
type DeleteParams = { folder: FolderTypes, imageUrl: string };

export async function uploadImage({ folder, file }: UploadParams) {
  const width = folder === 'avatars' ? 400 : folder === 'covers' ? 1500 : 800;
  const height = folder === 'avatars' ? 400 : folder === 'covers' ? 500 : undefined;

  const compresedImage = await sharp(file.buffer)
    .resize(width, height)
    .toFormat('webp')
    .toBuffer();

  const resultImageUpload = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder, format: 'webp' }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
    ).end(compresedImage);
  });

  return (resultImageUpload as UploadApiResponse).secure_url;
}

export function deleteImage({ folder, imageUrl }: DeleteParams) {
  const match = imageUrl.match(/([^/]+)\.webp$/);
  if (!match) return;

  const publicID = `${folder}/${match[1]}`;
  cloudinary.uploader
    .destroy(publicID)
    .then(result => console.log('Estado de la images', result.result));
}
