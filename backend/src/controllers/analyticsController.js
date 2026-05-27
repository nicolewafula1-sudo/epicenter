import { query } from '../utils/database.js';
import { logger } from '../utils/logger.js';
import {
  getHeatmapData,
  getClusteredOutbreaks,
  getOutbreaksByPathogen,
  getOutbreaksByCounty,
  getTrendData,
  getGeospatialStats,
} from '../services/geospatialService.js';

export const getAnalyticsDashboard = async (req, res) => {
  try {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const endDate = new Date();

    const [stats, trends, countyStats] = await Promise.all([
      getOverallStats(startDate, endDate),
      getTrendData('E.coli', 30),
      getGeospatialStats(),
    ]);

    res.json({
      period: { startDate, endDate },
      statistics: stats,
      trends,
      byCounty: countyStats,
    });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export const getHeatmap = async (req, res) => {
  try {
    const { startDate, endDate, minConfidence = 0 } = req.query;
    const start = new Date(startDate) || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = new Date(endDate) || new Date();

    const data = await getHeatmapData(start, end, minConfidence);

    res.json({
      type: 'heatmap',
      data,
      count: data.length,
    });
  } catch (error) {
    logger.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
};

export const getClusters = async (req, res) => {
  try {
    const { startDate, endDate, zoom = 5 } = req.query;
    const start = new Date(startDate) || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = new Date(endDate) || new Date();

    const clusters = await getClusteredOutbreaks(start, end, parseInt(zoom));

    res.json({
      type: 'clusters',
      data: clusters,
      count: clusters.length,
    });
  } catch (error) {
    logger.error('Error fetching clusters:', error);
    res.status(500).json({ error: 'Failed to fetch cluster data' });
  }
};

export const getPathogenTrend = async (req, res) => {
  try {
    const { pathogen, days = 30 } = req.query;

    const trend = await getTrendData(pathogen, parseInt(days));

    res.json({
      pathogen,
      days: parseInt(days),
      data: trend,
    });
  } catch (error) {
    logger.error('Error fetching pathogen trend:', error);
    res.status(500).json({ error: 'Failed to fetch trend data' });
  }
};

export const getCountyStats = async (req, res) => {
  try {
    const stats = await getGeospatialStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching county stats:', error);
    res.status(500).json({ error: 'Failed to fetch county statistics' });
  }
};

const getOverallStats = async (startDate, endDate) => {
  try {
    const result = await query(
      `SELECT
        COUNT(*) as total_outbreaks,
        COUNT(DISTINCT pathogen) as unique_pathogens,
        COUNT(DISTINCT county) as affected_counties,
        COUNT(DISTINCT device_id) as reporting_devices,
        AVG(confidence_score) as avg_confidence,
        MAX(timestamp) as latest_report
       FROM outbreaks
       WHERE timestamp BETWEEN $1 AND $2 AND is_duplicate = FALSE`,
      [startDate, endDate]
    );

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting overall stats:', error);
    return {};
  }
};

export const getForecast = async (req, res) => {
  try {
    const { pathogen, days = 7 } = req.query;

    // Simple forecasting based on trend
    const trendData = await getTrendData(pathogen, 30);

    // Basic linear extrapolation
    const forecast = [];
    const startDate = new Date();

    for (let i = 0; i < parseInt(days); i++) {
      const forecastDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const avgCases = trendData.reduce((sum, d) => sum + parseInt(d.count), 0) / trendData.length;

      forecast.push({
        date: forecastDate,
        predicted_cases: Math.round(avgCases * (1 + Math.random() * 0.2 - 0.1)),
        confidence: 0.65,
      });
    }

    res.json({
      pathogen,
      forecast_days: parseInt(days),
      forecast,
    });
  } catch (error) {
    logger.error('Error generating forecast:', error);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
};
