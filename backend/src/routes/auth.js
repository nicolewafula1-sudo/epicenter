import express from 'express';
import {
  register,
  login,
  registerDevice,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, loginSchema, registerSchema } from '../utils/validation.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/device/register', authenticateToken, registerDevice);

export default router;
