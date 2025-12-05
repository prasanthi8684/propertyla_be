import { Router } from 'express';
import * as imageUploadController from '../controllers/imageUploadController.js';
import { upload } from '../services/imageUploadService.js';
import { authenticateSupabaseToken } from '../middleware/supabaseAuth.js';

const router = Router();

router.post(
  '/upload-multiple',
  authenticateSupabaseToken,
  upload.array('images', 10),
  imageUploadController.uploadImages
);

router.post(
  '/upload-single',
  authenticateSupabaseToken,
  upload.single('image'),
  imageUploadController.uploadSingleImage
);

router.delete(
  '/delete',
  authenticateSupabaseToken,
  imageUploadController.deleteImage
);

export default router;
