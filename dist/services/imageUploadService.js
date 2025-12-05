import AWS from 'aws-sdk';
import multer from 'multer';
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT || '');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
    region: process.env.DO_SPACES_REGION || 'nyc3'
});
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
    }
};
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
export const uploadToSpaces = async (file, folder = 'properties') => {
    const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const params = {
        Bucket: process.env.DO_SPACES_BUCKET || '',
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype
    };
    try {
        const data = await s3.upload(params).promise();
        return data.Location;
    }
    catch (error) {
        console.error('Error uploading to DigitalOcean Spaces:', error);
        throw new Error('Failed to upload image');
    }
};
export const uploadMultipleToSpaces = async (files, folder = 'properties') => {
    if (files.length > 10) {
        throw new Error('Maximum 10 images allowed');
    }
    const uploadPromises = files.map(file => uploadToSpaces(file, folder));
    try {
        const urls = await Promise.all(uploadPromises);
        return urls;
    }
    catch (error) {
        throw new Error('Failed to upload one or more images');
    }
};
export const deleteFromSpaces = async (fileUrl) => {
    const fileName = fileUrl.split('/').slice(-2).join('/');
    const params = {
        Bucket: process.env.DO_SPACES_BUCKET || '',
        Key: fileName
    };
    try {
        await s3.deleteObject(params).promise();
    }
    catch (error) {
        console.error('Error deleting from DigitalOcean Spaces:', error);
        throw new Error('Failed to delete image');
    }
};
export const deleteMultipleFromSpaces = async (fileUrls) => {
    const deletePromises = fileUrls.map(url => deleteFromSpaces(url));
    try {
        await Promise.all(deletePromises);
    }
    catch (error) {
        console.error('Error deleting multiple images:', error);
    }
};
//# sourceMappingURL=imageUploadService.js.map