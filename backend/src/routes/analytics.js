import express from 'express';
import {
  getAnalyticsDashboard,
  getHeatmap,
  getClusters,
  getPathogenTrend,
  getCountyStats,
  getForecast,
} from '../controllers/analyticsController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, getAnalyticsDashboard);
router.get('/heatmap', authenticateToken, getHeatmap);
router.get('/clusters', authenticateToken, getClusters);
router.get('/trend/:pathogen', authenticateToken, getPathogenTrend);
router.get('/counties', authenticateToken, getCountyStats);
router.get('/forecast', authenticateToken, getForecast);

export default router;
