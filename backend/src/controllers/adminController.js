import { query } from '../utils/database.js';
import { logger } from '../utils/logger.js';
import { getAuditTrail } from '../services/duplicateService.js';

export const getAuditLogs = async (req, res) => {
  try {
    const { limit = 500, offset = 0, device_id, start_date, end_date } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (device_id) {
      whereClause += ` AND device_id = $${params.length + 1}`;
      params.push(device_id);
    }

    if (start_date) {
      whereClause += ` AND timestamp >= $${params.length + 1}`;
      params.push(new Date(start_date));
    }

    if (end_date) {
      whereClause += ` AND timestamp <= $${params.length + 1}`;
      params.push(new Date(end_date));
    }

    whereClause += ` ORDER BY timestamp DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Math.min(limit, 1000), offset);

    const result = await query(
      `SELECT * FROM audit_logs ${whereClause}`,
      params
    );

    res.json({
      logs: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    logger.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

export const getDuplicateReport = async (req, res) => {
  try {
    const result = await query(
      `SELECT dt.*, o1.pathogen, o1.device_id as device_1, o2.device_id as device_2
       FROM duplicate_tracking dt
       JOIN outbreaks o1 ON dt.outbreak_id_1 = o1.id
       JOIN outbreaks o2 ON dt.outbreak_id_2 = o2.id
       ORDER BY dt.merged_at DESC
       LIMIT 100`
    );

    res.json({
      duplicates: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    logger.error('Error fetching duplicate report:', error);
    res.status(500).json({ error: 'Failed to fetch duplicate report' });
  }
};

export const getDeviceReport = async (req, res) => {
  try {
    const result = await query(
      `SELECT d.*, COUNT(o.id) as outbreaks_submitted
       FROM devices d
       LEFT JOIN outbreaks o ON d.id = o.device_id
       GROUP BY d.id
       ORDER BY d.created_at DESC`
    );

    res.json({
      devices: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    logger.error('Error fetching device report:', error);
    res.status(500).json({ error: 'Failed to fetch device report' });
  }
};

export const getUserReport = async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.email, u.role, COUNT(d.id) as devices
       FROM users u
       LEFT JOIN devices d ON u.id = d.user_id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );

    res.json({
      users: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    logger.error('Error fetching user report:', error);
    res.status(500).json({ error: 'Failed to fetch user report' });
  }
};

export const getOutbreakAuditTrail = async (req, res) => {
  try {
    const { outbreak_id } = req.params;
    const trail = await getAuditTrail(outbreak_id);

    res.json({
      outbreak_id,
      audit_trail: trail,
    });
  } catch (error) {
    logger.error('Error fetching outbreak audit trail:', error);
    res.status(500).json({ error: 'Failed to fetch audit trail' });
  }
};

export const getSystemHealth = async (req, res) => {
  try {
    const result = await query(
      `SELECT
        COUNT(DISTINCT device_id) as active_devices,
        COUNT(*) as total_outbreaks,
        COUNT(CASE WHEN is_duplicate = FALSE THEN 1 END) as unique_outbreaks,
        MAX(timestamp) as latest_report,
        AVG(confidence_score) as avg_confidence
       FROM outbreaks`
    );

    const stats = result.rows[0];

    res.json({
      system_health: {
        ...stats,
        status: stats.active_devices > 0 ? 'healthy' : 'degraded',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    logger.error('Error checking system health:', error);
    res.status(500).json({ error: 'Failed to check system health' });
  }
};
