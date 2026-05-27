import { query } from '../utils/database.js';
import { logger } from '../utils/logger.js';

export const assignCounty = async (latitude, longitude) => {
  try {
    // Query PostGIS to find which county contains the point
    const result = await query(
      `SELECT name FROM kenya_counties
       WHERE ST_Contains(boundary, ST_Point($1, $2, 4326))
       LIMIT 1`,
      [longitude, latitude]
    );

    if (result.rows.length > 0) {
      return result.rows[0].name;
    }

    // Fallback: find nearest county
    const nearestResult = await query(
      `SELECT name FROM kenya_counties
       ORDER BY ST_Distance(boundary, ST_Point($1, $2, 4326))
       LIMIT 1`,
      [longitude, latitude]
    );

    return nearestResult.rows.length > 0 ? nearestResult.rows[0].name : 'Unknown';
  } catch (error) {
    logger.error('Error assigning county:', error);
    return 'Unknown';
  }
};

export const getHeatmapData = async (startDate, endDate, minConfidence = 0) => {
  try {
    const result = await query(
      `SELECT latitude, longitude, COUNT(*) as count, pathogen
       FROM outbreaks
       WHERE timestamp BETWEEN $1 AND $2
         AND is_duplicate = FALSE
         AND confidence_score >= $3
       GROUP BY latitude, longitude, pathogen`,
      [startDate, endDate, minConfidence]
    );

    return result.rows;
  } catch (error) {
    logger.error('Error getting heatmap data:', error);
    throw error;
  }
};

export const getClusteredOutbreaks = async (startDate, endDate, zoomLevel) => {
  try {
    // Use PostGIS to cluster nearby outbreaks
    const result = await query(
      `SELECT 
        ST_X(ST_Centroid(ST_Collect(location))) as latitude,
        ST_Y(ST_Centroid(ST_Collect(location))) as longitude,
        COUNT(*) as count,
        ARRAY_AGG(DISTINCT pathogen) as pathogens,
        MAX(confidence_score) as max_confidence
       FROM outbreaks
       WHERE timestamp BETWEEN $1 AND $2 AND is_duplicate = FALSE
       GROUP BY ST_GeoHash(location, $3)`,
      [startDate, endDate, Math.max(2, 10 - zoomLevel)]
    );

    return result.rows;
  } catch (error) {
    logger.error('Error getting clustered outbreaks:', error);
    throw error;
  }
};

export const getOutbreaksByPathogen = async (pathogen, startDate, endDate) => {
  try {
    const result = await query(
      `SELECT * FROM outbreaks
       WHERE pathogen = $1
         AND timestamp BETWEEN $2 AND $3
         AND is_duplicate = FALSE
       ORDER BY timestamp DESC`,
      [pathogen, startDate, endDate]
    );

    return result.rows;
  } catch (error) {
    logger.error('Error getting outbreaks by pathogen:', error);
    throw error;
  }
};

export const getOutbreaksByCounty = async (county, startDate, endDate) => {
  try {
    const result = await query(
      `SELECT * FROM outbreaks
       WHERE county = $1
         AND timestamp BETWEEN $2 AND $3
         AND is_duplicate = FALSE
       ORDER BY timestamp DESC`,
      [county, startDate, endDate]
    );

    return result.rows;
  } catch (error) {
    logger.error('Error getting outbreaks by county:', error);
    throw error;
  }
};

export const getTrendData = async (pathogen, days = 30) => {
  try {
    const result = await query(
      `SELECT DATE(timestamp) as date, COUNT(*) as count
       FROM outbreaks
       WHERE pathogen = $1
         AND timestamp >= CURRENT_DATE - INTERVAL '$2 days'
         AND is_duplicate = FALSE
       GROUP BY DATE(timestamp)
       ORDER BY date ASC`,
      [pathogen, days]
    );

    return result.rows;
  } catch (error) {
    logger.error('Error getting trend data:', error);
    throw error;
  }
};

export const getGeospatialStats = async () => {
  try {
    const result = await query(
      `SELECT 
        county,
        COUNT(*) as total_outbreaks,
        COUNT(DISTINCT pathogen) as pathogen_diversity,
        MAX(confidence_score) as max_confidence,
        AVG(confidence_score) as avg_confidence
       FROM outbreaks
       WHERE is_duplicate = FALSE
       GROUP BY county
       ORDER BY total_outbreaks DESC`
    );

    return result.rows;
  } catch (error) {
    logger.error('Error getting geospatial stats:', error);
    throw error;
  }
};
