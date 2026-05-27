import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../utils/database.js';
import { logger } from '../utils/logger.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.validatedData;

    // Check if user exists
    const existingUser = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role`,
      [username, email, passwordHash, role || 'operator']
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    logger.info(`User registered: ${username} with role ${user.role}`);

    res.status(201).json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.validatedData;

    // Find user
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    logger.info(`User logged in: ${username}`);

    res.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
      token,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const registerDevice = async (req, res) => {
  try {
    const { device_id, device_name, device_type } = req.body;
    const userId = req.user.id;

    // Check if device already exists
    const existing = await query(
      'SELECT * FROM devices WHERE id = $1',
      [device_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Device already registered' });
    }

    // Register device
    const result = await query(
      `INSERT INTO devices (id, user_id, device_name, device_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [device_id, userId, device_name, device_type]
    );

    // Generate device token
    const deviceToken = jwt.sign(
      { device_id, user_id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    logger.info(`Device registered: ${device_id}`);

    res.status(201).json({
      success: true,
      device: result.rows[0],
      deviceToken,
    });
  } catch (error) {
    logger.error('Device registration error:', error);
    res.status(500).json({ error: 'Device registration failed' });
  }
};
