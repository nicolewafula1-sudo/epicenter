import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { logger } from './logger.js';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      logger.warn(`Slow query (${duration}ms): ${text}`);
    }
    return result;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    // Test connection
    const result = await query('SELECT NOW()');
    logger.info('Database connection established');

    // Create extensions
    await query('CREATE EXTENSION IF NOT EXISTS "postgis"');
    logger.info('PostGIS extension enabled');

    // Create tables
    await createTables();
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

const createTables = async () => {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'operator',
      device_ids TEXT[],
      county VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Devices table
    `CREATE TABLE IF NOT EXISTS devices (
      id VARCHAR(255) PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      device_name VARCHAR(255) NOT NULL,
      device_type VARCHAR(100),
      battery_level FLOAT,
      connectivity_status VARCHAR(50),
      last_sync TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Outbreaks table (main data table)
    `CREATE TABLE IF NOT EXISTS outbreaks (
      id SERIAL PRIMARY KEY,
      device_id VARCHAR(255) NOT NULL REFERENCES devices(id),
      pathogen VARCHAR(255) NOT NULL,
      result VARCHAR(50) NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      location GEOMETRY(Point, 4326),
      latitude FLOAT,
      longitude FLOAT,
      county VARCHAR(100),
      country VARCHAR(100) DEFAULT 'Kenya',
      sample_type VARCHAR(100),
      confidence_score FLOAT,
      is_duplicate BOOLEAN DEFAULT FALSE,
      original_id INTEGER,
      battery_level FLOAT,
      connectivity_status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Audit logs table
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      device_id VARCHAR(255),
      user_id INTEGER,
      action VARCHAR(255) NOT NULL,
      outbreak_id INTEGER,
      details JSONB,
      ip_address VARCHAR(50),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Pathogen whitelist table
    `CREATE TABLE IF NOT EXISTS pathogen_whitelist (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      category VARCHAR(100),
      severity VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Kenya counties lookup table
    `CREATE TABLE IF NOT EXISTS kenya_counties (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      boundary GEOMETRY(Polygon, 4326),
      population INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Duplicate detection tracking
    `CREATE TABLE IF NOT EXISTS duplicate_tracking (
      id SERIAL PRIMARY KEY,
      outbreak_id_1 INTEGER REFERENCES outbreaks(id),
      outbreak_id_2 INTEGER REFERENCES outbreaks(id),
      similarity_score FLOAT,
      merged BOOLEAN DEFAULT FALSE,
      merged_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const table of tables) {
    try {
      await query(table);
    } catch (error) {
      logger.error('Error creating table:', error);
    }
  }

  // Create indexes for performance
  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_outbreaks_device_id ON outbreaks(device_id)`,
    `CREATE INDEX IF NOT EXISTS idx_outbreaks_timestamp ON outbreaks(timestamp)`,
    `CREATE INDEX IF NOT EXISTS idx_outbreaks_county ON outbreaks(county)`,
    `CREATE INDEX IF NOT EXISTS idx_outbreaks_pathogen ON outbreaks(pathogen)`,
    `CREATE INDEX IF NOT EXISTS idx_outbreaks_location ON outbreaks USING GIST(location)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_logs_device ON audit_logs(device_id)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)`,
    `CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`
  ];

  for (const index of indexes) {
    try {
      await query(index);
    } catch (error) {
      // Index might already exist, ignore
    }
  }

  logger.info('Database tables and indexes created');
};

export const getPool = () => pool;
