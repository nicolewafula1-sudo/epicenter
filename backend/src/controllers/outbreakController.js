import { query } from '../utils/database.js';
import { logger } from '../utils/logger.js';
import { broadcastOutbreakUpdate } from '../utils/websocket.js';
import { assignCounty } from '../services/geospatialService.js';
import { detectDuplicates, mergeDuplicates } from '../services/duplicateService.js';
import { validatePathogen } from '../utils/validation.js';

export const uploadOutbreakResult = async (req, res) => {
  try {
    const {
      device_id,
      pathogen,
      result,
      timestamp,
      latitude,
      longitude,
      sample_type,
      confidence_score,
      battery_level,
      connectivity_status,
    } = req.validatedData;

    // Validate pathogen
    if (!validatePathogen(pathogen)) {
      return res.status(400).json({
        error: `Invalid pathogen: ${pathogen}. Allowed: E.coli, Salmonella, Cholera, etc.`,
      });
    }

    // Assign county
    const county = await assignCounty(latitude, longitude);

    // Check device exists
    const deviceResult = await query('SELECT * FROM devices WHERE id = $1', [device_id]);
    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Create the outbreak record
    const insertResult = await query(
      `INSERT INTO outbreaks (
        device_id, pathogen, result, timestamp, location, latitude, longitude,
        county, sample_type, confidence_score, battery_level, connectivity_status
      ) VALUES (
        $1, $2, $3, $4, ST_Point($5, $6, 4326), $5, $6,
        $7, $8, $9, $10, $11
      ) RETURNING *`,
      [
        device_id,
        pathogen,
        result,
        timestamp,
        longitude,
        latitude,
        county,
        sample_type,
        confidence_score || 0.9,
        battery_level,
        connectivity_status,
      ]
    );

    const outbreak = insertResult.rows[0];

    // Create audit log
    await query(
      `INSERT INTO audit_logs (device_id, action, outbreak_id, details)
       VALUES ($1, $2, $3, $4)`,
      [device_id, 'OUTBREAK_UPLOADED', outbreak.id, JSON.stringify({
        pathogen,
        result,
        county,
        battery_level,
        connectivity_status,
      })]
    );

    // Detect duplicates asynchronously
    setImmediate(async () => {
      try {
        const duplicates = await detectDuplicates(outbreak);
        if (duplicates.length > 0) {
          await mergeDuplicates(outbreak.id, duplicates.map(d => d.candidateId));
          logger.info(`Found and merged ${duplicates.length} duplicate outbreaks`);
        }
      } catch (error) {
        logger.error('Error processing duplicates:', error);
      }
    });

    // Broadcast real-time update
    broadcastOutbreakUpdate(outbreak);

    res.status(201).json({
      success: true,
      outbreak: {
        id: outbreak.id,
        pathogen: outbreak.pathogen,
        county: outbreak.county,
        timestamp: outbreak.timestamp,
        device_id: outbreak.device_id,
      },
    });

    logger.info(`Outbreak recorded: ${pathogen} in ${county}`);
  } catch (error) {
    logger.error('Error uploading outbreak:', error);
    res.status(500).json({ error: 'Failed to upload outbreak data' });
  }
};

export const getOutbreakById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM outbreaks WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Outbreak not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching outbreak:', error);
    res.status(500).json({ error: 'Failed to fetch outbreak' });
  }
};

export const getRecentOutbreaks = async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const result = await query(
      `SELECT * FROM outbreaks
       WHERE is_duplicate = FALSE
       ORDER BY timestamp DESC
       LIMIT $1 OFFSET $2`,
      [Math.min(limit, 1000), offset]
    );

    res.json({
      outbreaks: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    logger.error('Error fetching recent outbreaks:', error);
    res.status(500).json({ error: 'Failed to fetch outbreaks' });
  }
};

export const updateDeviceHealth = async (req, res) => {
  try {
    const { device_id, battery_level, connectivity_status } = req.body;

    await query(
      `UPDATE devices
       SET battery_level = $1, connectivity_status = $2, last_sync = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [battery_level, connectivity_status, device_id]
    );

    res.json({ success: true });
  } catch (error) {
    logger.error('Error updating device health:', error);
    res.status(500).json({ error: 'Failed to update device' });
  }
};
