import express from 'express';
import {
  getAuditLogs,
  getDuplicateReport,
  getDeviceReport,
  getUserReport,
  getOutbreakAuditTrail,
  getSystemHealth,
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All admin endpoints require admin role
router.use(authenticateToken, authorizeRole('admin', 'health_official'));

router.get('/audit-logs', getAuditLogs);
router.get('/duplicates', getDuplicateReport);
router.get('/devices', getDeviceReport);
router.get('/users', authorizeRole('admin'), getUserReport);
router.get('/outbreaks/:outbreak_id/audit', getOutbreakAuditTrail);
router.get('/health', getSystemHealth);

export default router;
