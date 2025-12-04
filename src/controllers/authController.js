import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { query } from '../config/database.js';
import crypto from 'crypto';

const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, phone_number, password } = req.body;

    const existingUserCheck = await query(
      'SELECT id, username, email, phone_number FROM users WHERE username = $1 OR email = $2 OR ($3 IS NOT NULL AND phone_number = $3)',
      [username, email, phone_number]
    );

    if (existingUserCheck.rows.length > 0) {
      const existingUser = existingUserCheck.rows[0];
      if (existingUser.username === username) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      if (phone_number && existingUser.phone_number === phone_number) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await query(
      `INSERT INTO users (username, email, phone_number, password_hash, verification_token, verification_expiry)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, phone_number, email_verified`,
      [username, email, phone_number || null, hashedPassword, verificationToken, verificationExpiry]
    );

    const user = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.email_verified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const userResult = await query(
      'SELECT id, email, password_hash, email_verified, username, phone_number FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    const token = generateToken(user.id, user.email);

    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          email_verified: user.email_verified
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token required'
      });
    }

    const userResult = await query(
      'SELECT id, verification_expiry FROM users WHERE verification_token = $1',
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    const user = userResult.rows[0];

    if (new Date() > new Date(user.verification_expiry)) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired'
      });
    }

    await query(
      'UPDATE users SET email_verified = true, verification_token = NULL, verification_expiry = NULL WHERE id = $1',
      [user.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
