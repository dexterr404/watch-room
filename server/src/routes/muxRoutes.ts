import express from 'express'
import { authenticate } from '../middleware/auth';
import { createMuxUploadUrl, deleteVideo, getMuxAsset } from '../controllers/muxController';

const router = express.Router();

router.post('/upload-url', authenticate, createMuxUploadUrl);
router.get('/asset/:uploadId', authenticate, getMuxAsset);
router.delete('/asset/:assetId', authenticate, deleteVideo);

export default router;