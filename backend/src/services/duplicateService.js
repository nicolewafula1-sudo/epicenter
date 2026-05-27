import { query } from '../utils/database.js';
import { logger } from '../utils/logger.js';

const DUPLICATE_THRESHOLD = 0.95; // 95% similarity threshold
const TIME_WINDOW_MINUTES = 30; // 30 minute window
const SPATIAL_TOLERANCE_KM = 1; // 1 km spatial tolerance

export const detectDuplicates = async (outbreak) => {
  try {
    // Look for similar outbreaks within time window and spatial tolerance
    const timeStart = new Date(new Date(outbreak.timestamp).getTime() - TIME_WINDOW_MINUTES * 60000);
    const timeEnd = new Date(new Date(outbreak.timestamp).getTime() + TIME_WINDOW_MINUTES * 60000);

    const result = await query(
      `SELECT id, device_id, pathogen, latitude, longitude, timestamp,
              ST_Distance(location::geography, ST_Point($1, $2)::geography) as distance_m
       FROM outbreaks
       WHERE pathogen = $3
         AND timestamp BETWEEN $4 AND $5
         AND is_duplicate = FALSE
         AND ST_DWithin(location::geography, ST_Point($1, $2)::geography, $6)
       ORDER BY distance_m ASC
       LIMIT 5`,
      [outbreak.longitude, outbreak.latitude, outbreak.pathogen, timeStart, timeEnd, SPATIAL_TOLERANCE_KM * 1000]
    );

    const candidates = result.rows;
    const duplicates = [];

    for (const candidate of candidates) {
      const similarity = calculateSimilarity(outbreak, candidate);
      if (similarity >= DUPLICATE_THRESHOLD) {
        duplicates.push({
          candidateId: candidate.id,
          similarity,
          distance: candidate.distance_m,
        });
      }
    }

    return duplicates;
  } catch (error) {
    logger.error('Error detecting duplicates:', error);
    throw error;
  }
};

export const mergeDuplicates = async (primaryId, duplicateIds) => {
  try {
    const client = await require('../utils/database.js').getPool().connect();
    try {
      await client.query('BEGIN');

      // Mark duplicates
      for (const duplicateId of duplicateIds) {
        await client.query(
          'UPDATE outbreaks SET is_duplicate = TRUE, original_id = $1 WHERE id = $2',
          [primaryId, duplicateId]
        );

        await client.query(
          `INSERT INTO duplicate_tracking (outbreak_id_1, outbreak_id_2, similarity_score, merged, merged_at)
           VALUES ($1, $2, $3, TRUE, CURRENT_TIMESTAMP)`,
          [primaryId, duplicateId, DUPLICATE_THRESHOLD]
        );
      }

      await client.query('COMMIT');
      logger.info(`Merged ${duplicateIds.length} duplicates with primary outbreak ${primaryId}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error('Error merging duplicates:', error);
    throw error;
  }
};

const calculateSimilarity = (outbreak1, outbreak2) => {
  let similarity = 0;
  let factors = 0;

  // Pathogen match
  if (outbreak1.pathogen === outbreak2.pathogen) {
    similarity += 1;
  }
  factors++;

  // Result match
  if (outbreak1.result === outbreak2.result) {
    similarity += 1;
  }
  factors++;

  // Spatial proximity (within 1km = high similarity)
  const distance = Math.sqrt(
    Math.pow(outbreak1.latitude - outbreak2.latitude, 2) +
    Math.pow(outbreak1.longitude - outbreak2.longitude, 2)
  );
  if (distance < 0.01) { // ~1km at equator
    similarity += 0.8;
  } else if (distance < 0.05) {
    similarity += 0.5;
  }
  factors++;

  // Time proximity (within 1 hour = high similarity)
  const timeDiff = Math.abs(new Date(outbreak1.timestamp) - new Date(outbreak2.timestamp));
  if (timeDiff < 60 * 60 * 1000) { // 1 hour
    similarity += 0.8;
  } else if (timeDiff < 6 * 60 * 60 * 1000) { // 6 hours
    similarity += 0.3;
  }
  factors++;

  return similarity / factors;
};

export const getAuditTrail = async (outbreakId) => {
  try {
    const result = await query(
      `SELECT * FROM audit_logs WHERE outbreak_id = $1 ORDER BY timestamp DESC`,
      [outbreakId]
    );
    return result.rows;
  } catch (error) {
    logger.error('Error fetching audit trail:', error);
    throw error;
  }
};
