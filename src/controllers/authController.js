import { validationResult } from 'express-validator';
import * as authService from '../services/authService.js';

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

    const result = await authService.registerUser({
      username,
      email,
      phoneNumber: phone_number,
      password
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: result
    });

  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }

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

    const result = await authService.loginUser({
      email,
      password
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });

  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }

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

    const result = await authService.verifyUserEmailToken(token);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: result
    });

  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }

    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
