import express from 'express';
import {
  uploadOutbreakResult,
  getOutbreakById,
  getRecentOutbreaks,
  updateDeviceHealth,
} from '../controllers/outbreakController.js';
import { authenticateToken, validateDeviceToken } from '../middleware/auth.js';
import { validateRequest, outbreakSchema } from '../utils/validation.js';

const router = express.Router();

// Public health check (no auth required)
router.post('/uploadResult', validateRequest(outbreakSchema), validateDeviceToken, uploadOutbreakResult);

// Authenticated endpoints
router.get('/recent', authenticateToken, getRecentOutbreaks);
router.get('/:id', authenticateToken, getOutbreakById);
router.post('/device/health', validateDeviceToken, updateDeviceHealth);

export default router;
